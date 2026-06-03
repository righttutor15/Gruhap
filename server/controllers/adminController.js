const { asyncHandler } = require('../Utils/asyncHandler');
const userService = require('../Services/userService');
const logger = require('../Utils/logger');

// Generate random mock data for fields not in Firestore
const getMockExtendedFields = (id, email) => {
    const plans = ['Free', 'Pro', 'Enterprise'];
    const statuses = ['Active', 'Inactive'];
    
    // Hash ID to get consistent random-looking values
    const hash = id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    
    return {
        plan: plans[Math.abs(hash) % 3],
        status: statuses[Math.abs(hash) % 2],
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        location: 'India',
        bio: 'User of GruhaP platform.',
        website: '',
        totalSessions: Math.abs(hash % 500),
        tokensUsed: `${Math.abs(hash % 100) + 1}k`,
        avgScore: `${70 + Math.abs(hash % 25)}%`,
        streakDays: Math.abs(hash % 30),
        lifetimeSpend: `₹${Math.abs(hash % 50) * 1000}`,
        renewalDate: '2024-12-31',
        paymentMethod: 'Card',
        phone: '+91 99999 99999'
    };
};

const getAllUsers = asyncHandler(async (req, res) => {
    logger.info(`Admin: Fetching all users`);
    const users = await userService.getAllUsers();
    
    const extendedUsers = users.map(user => {
        const mockFields = getMockExtendedFields(user.id, user.email);
        
        let joinedDate = 'Unknown';
        if (user.createdAt) {
             const date = new Date(user.createdAt._seconds ? user.createdAt._seconds * 1000 : user.createdAt);
             joinedDate = date.toISOString().split('T')[0];
        }

        return {
            ...user,
            ...mockFields,
            joined: joinedDate
        };
    });

    return res.status(200).json({
        success: true,
        data: extendedUsers
    });
});

const getUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    logger.info(`Admin: Fetching details for user ${id}`);
    
    // In a real scenario we'd fetch one user, but userService doesn't have getUserById yet
    // So we fetch all and filter for now (not ideal for production, but works for MVP)
    const users = await userService.getAllUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const mockFields = getMockExtendedFields(user.id, user.email);
    let joinedDate = 'Unknown';
    if (user.createdAt) {
         const date = new Date(user.createdAt._seconds ? user.createdAt._seconds * 1000 : user.createdAt);
         joinedDate = date.toISOString().split('T')[0];
    }

    // Mock specific arrays for the detail view
    const dailyUsage = [
        { day: 'Mon', minutes: 45, tokens: 320 },
        { day: 'Tue', minutes: 62, tokens: 480 },
        { day: 'Wed', minutes: 30, tokens: 210 },
        { day: 'Thu', minutes: 78, tokens: 590 },
        { day: 'Fri', minutes: 55, tokens: 410 },
        { day: 'Sat', minutes: 92, tokens: 720 },
        { day: 'Sun', minutes: 40, tokens: 280 },
    ];
    
    const subjectData = [
        { name: 'Physics', value: 35, color: '#aa3bff' },
        { name: 'Chemistry', value: 28, color: '#2495d5' },
        { name: 'Mathematics', value: 22, color: '#f59e0b' },
        { name: 'Biology', value: 15, color: '#10b981' },
    ];

    const activityLog = [
        { id: 1, action: 'Completed Mock Test', detail: 'Physics', time: '2 hours ago', type: 'test' },
        { id: 2, action: 'Asked AI Tutor', detail: 'Math', time: '4 hours ago', type: 'question' },
        { id: 3, action: 'Logged In', detail: 'Web Browser', time: '5 hours ago', type: 'login' },
    ];

    return res.status(200).json({
        success: true,
        data: {
            ...user,
            ...mockFields,
            joined: joinedDate,
            dailyUsage,
            subjectData,
            activityLog
        }
    });
});

const getStats = asyncHandler(async (req, res) => {
    logger.info(`Admin: Fetching stats`);
    
    const users = await userService.getAllUsers();
    const totalUsers = users.length;
    
    // Group users by exam category
    const examCounts = {};
    users.forEach(u => {
        const cat = u.exam || 'Other';
        examCounts[cat] = (examCounts[cat] || 0) + 1;
    });
    
    const colors = ['#aa3bff', '#2495d5', '#f59e0b', '#10b981'];
    const categoryData = Object.keys(examCounts).map((cat, idx) => ({
        name: `${cat} Prep`,
        value: examCounts[cat],
        color: colors[idx % colors.length]
    }));
    
    // Calculate user growth by month dynamically
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthMap = {};
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mKey = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
        growthMap[mKey] = 0;
    }
    
    users.forEach(u => {
        if (u.createdAt) {
            const date = new Date(u.createdAt._seconds ? u.createdAt._seconds * 1000 : u.createdAt);
            const mKey = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
            if (growthMap[mKey] !== undefined) {
                growthMap[mKey] += 1;
            }
        }
    });
    
    const userGrowthData = Object.keys(growthMap).map(key => ({
        name: key.split(' ')[0],
        users: growthMap[key],
        tokens: growthMap[key] * 120
    }));

    // Calculate total tokens
    let totalTokensUsed = 0;
    users.forEach(u => {
        const mockFields = getMockExtendedFields(u.id, u.email);
        const tokenNum = parseFloat(mockFields.tokensUsed.replace('k', '')) || 0;
        totalTokensUsed += tokenNum;
    });
    
    // Calculate total revenue from user plans
    let totalRevenue = 0;
    users.forEach(u => {
        const mockFields = getMockExtendedFields(u.id, u.email);
        if (mockFields.plan === 'Pro') totalRevenue += 1200;
        if (mockFields.plan === 'Enterprise') totalRevenue += 10000;
    });

    const kpiData = [
        { title: 'Total Users', value: totalUsers.toLocaleString(), trend: 'up', trendValue: 12.5 },
        { title: 'Active Tokens', value: `${totalTokensUsed.toFixed(1)}k`, trend: 'up', trendValue: 8.2 },
        { title: 'Avg. Session', value: '24m 12s', trend: 'down', trendValue: 3.1 },
        { title: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: 'up', trendValue: 15.4 },
    ];

    const analyticsKpiData = [
        { title: 'Daily Active Users', value: Math.ceil(totalUsers * 0.35).toString(), trend: 'up', trendValue: 9.3 },
        { title: 'Avg. Session', value: '24m 12s', trend: 'up', trendValue: 5.7 },
        { title: 'Bounce Rate', value: '18.4%', trend: 'down', trendValue: 2.1 },
        { title: 'Conversion Rate', value: '6.8%', trend: 'up', trendValue: 1.4 },
    ];

    const peakHours = [
        { hour: '6 AM', users: Math.ceil(totalUsers * 0.05) }, 
        { hour: '8 AM', users: Math.ceil(totalUsers * 0.12) }, 
        { hour: '10 AM', users: Math.ceil(totalUsers * 0.28) },
        { hour: '12 PM', users: Math.ceil(totalUsers * 0.35) }, 
        { hour: '2 PM', users: Math.ceil(totalUsers * 0.41) }, 
        { hour: '4 PM', users: Math.ceil(totalUsers * 0.38) },
        { hour: '6 PM', users: Math.ceil(totalUsers * 0.52) }, 
        { hour: '8 PM', users: Math.ceil(totalUsers * 0.68) }, 
        { hour: '10 PM', users: Math.ceil(totalUsers * 0.45) },
        { hour: '12 AM', users: Math.ceil(totalUsers * 0.18) },
    ];

    const platformData = [
        { platform: 'Chrome', sessions: Math.ceil(totalUsers * 4.2), color: '#4285F4' },
        { platform: 'Safari', sessions: Math.ceil(totalUsers * 1.8), color: '#FF6B6B' },
        { platform: 'Mobile App', sessions: Math.ceil(totalUsers * 2.8), color: '#10b981' },
        { platform: 'Firefox', sessions: Math.ceil(totalUsers * 0.8), color: '#FF9500' },
        { platform: 'Edge', sessions: Math.ceil(totalUsers * 0.5), color: '#0078D4' },
    ];

    const deviceStats = [
        { label: 'Desktop', value: '58%', sessions: Math.ceil(totalUsers * 6.1).toString(), color: 'bg-blue-500' },
        { label: 'Mobile', value: '35%', sessions: Math.ceil(totalUsers * 3.7).toString(), color: 'bg-emerald-500' },
        { label: 'Tablet', value: '7%', sessions: Math.ceil(totalUsers * 0.7).toString(), color: 'bg-amber-500' },
    ];

    return res.status(200).json({
        success: true,
        data: {
            kpiData,
            analyticsKpiData,
            peakHours,
            platformData,
            deviceStats,
            userGrowthData,
            categoryData
        }
    });
});

const getRevenue = asyncHandler(async (req, res) => {
    logger.info(`Admin: Fetching revenue`);

    const users = await userService.getAllUsers();
    
    let totalRevenue = 0;
    let mrr = 0;
    let proCount = 0;
    let entCount = 0;
    let freeCount = 0;
    
    const transactions = [];

    users.forEach((u) => {
        const mockFields = getMockExtendedFields(u.id, u.email);
        
        let joinedDate = '2024-06-01';
        if (u.createdAt) {
             const date = new Date(u.createdAt._seconds ? u.createdAt._seconds * 1000 : u.createdAt);
             joinedDate = date.toISOString().split('T')[0];
        }

        if (mockFields.plan === 'Pro') {
            proCount++;
            totalRevenue += 1200;
            mrr += 1200;
            transactions.push({
                id: u.id,
                name: u.name || 'Anonymous',
                email: u.email,
                avatar: mockFields.avatar,
                plan: 'Pro',
                amount: '₹1,200',
                date: joinedDate,
                status: 'Completed'
            });
        } else if (mockFields.plan === 'Enterprise') {
            entCount++;
            totalRevenue += 10000;
            mrr += 10000;
            transactions.push({
                id: u.id,
                name: u.name || 'Anonymous',
                email: u.email,
                avatar: mockFields.avatar,
                plan: 'Enterprise',
                amount: '₹10,000',
                date: joinedDate,
                status: 'Completed'
            });
        } else {
            freeCount++;
        }
    });

    const monthlyRevenue = [
        { month: 'Mar', revenue: Math.ceil(totalRevenue * 0.7), expenses: Math.ceil(totalRevenue * 0.2) },
        { month: 'Apr', revenue: Math.ceil(totalRevenue * 0.8), expenses: Math.ceil(totalRevenue * 0.25) },
        { month: 'May', revenue: Math.ceil(totalRevenue * 0.9), expenses: Math.ceil(totalRevenue * 0.22) },
        { month: 'Jun', revenue: totalRevenue, expenses: Math.ceil(totalRevenue * 0.23) },
    ];

    const planRevenue = [
        { plan: 'Free', revenue: 0, users: freeCount },
        { plan: 'Pro', revenue: proCount * 1200, users: proCount },
        { plan: 'Enterprise', revenue: entCount * 10000, users: entCount },
    ];

    const revenueBreakdown = [
        { name: 'Pro Subscriptions', value: totalRevenue ? Math.round((proCount * 1200 / totalRevenue) * 100) : 0, color: 'hsl(var(--cta-orange))' },
        { name: 'Enterprise Plans', value: totalRevenue ? Math.round((entCount * 10000 / totalRevenue) * 100) : 0, color: '#aa3bff' },
        { name: 'One-time Purchases', value: 0, color: '#2495d5' },
    ];

    const kpiData = [
        { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: 'up', trendValue: 24.3, description: 'All-time platform revenue' },
        { title: 'Monthly Recurring', value: `₹${mrr.toLocaleString()}`, trend: 'up', trendValue: 15.8, description: 'MRR from current users' },
        { title: 'Avg. Per User', value: users.length ? `₹${Math.round(totalRevenue / users.length)}` : '₹0', trend: 'up', trendValue: 8.2, description: 'ARPU (all plans)' },
        { title: 'Churn Rate', value: '3.2%', trend: 'down', trendValue: 1.1, description: 'vs 4.3% last month' },
    ];

    return res.status(200).json({
        success: true,
        data: {
            monthlyRevenue,
            planRevenue,
            revenueBreakdown,
            transactions,
            kpiData
        }
    });
});

const getInquiries = asyncHandler(async (req, res) => {
    logger.info(`Admin: Fetching inquiries`);
    const inquiries = [
        { id: 1, name: 'Siddharth Rao', email: 'sid.rao@gmail.com', subject: 'Pro Plan Features', message: 'I want to know if the Pro plan includes 1-on-1 mentoring sessions.', status: 'Pending', date: '2024-04-06 14:20' },
        { id: 2, name: 'Ananya Iyer', email: 'ananya.i@outlook.com', subject: 'Technical Issue', message: 'The AI tutor is not responding to my questions.', status: 'Urgent', date: '2024-04-06 12:45' },
        { id: 3, name: 'Rohan Deshmukh', email: 'rohan.d@yahoo.com', subject: 'Partnership Inquiry', message: 'We are an educational NGO interested in using GruhaP.', status: 'Resolved', date: '2024-04-05 18:10' },
    ];

    return res.status(200).json({
        success: true,
        data: inquiries
    });
});

module.exports = {
    getAllUsers,
    getUserDetails,
    getStats,
    getRevenue,
    getInquiries
};
