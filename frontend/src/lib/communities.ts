import { BookOpen, Atom, FlaskConical, Calculator, Microscope, Brain, Dna, Zap, Globe, PenTool, Landmark, TrendingUp, Palette, Code, Layers, Megaphone, MessageSquare, Star, Terminal, type LucideIcon } from "lucide-react";

export interface SubCommunity {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  members: number;
  description: string;
  color: string;
  activeNow: number;
  isCustom?: boolean;
}

export const defaultCommunities: SubCommunity[] = [
  // Exam-focused
  {
    id: "neet-bio",
    name: "NEET Biology",
    shortName: "g/NEETBio",
    icon: Dna,
    members: 12400,
    description: "All things biology for NEET aspirants — genetics, ecology, human physiology & more.",
    color: "bg-emerald-500/15 text-emerald-600",
    activeNow: 234,
  },
  {
    id: "neet-chem",
    name: "NEET Chemistry",
    shortName: "g/NEETChem",
    icon: FlaskConical,
    members: 9800,
    description: "Organic, inorganic & physical chemistry discussions for NEET prep.",
    color: "bg-purple-500/15 text-purple-600",
    activeNow: 187,
  },
  {
    id: "jee-physics",
    name: "JEE Physics",
    shortName: "g/JEEPhysics",
    icon: Zap,
    members: 15200,
    description: "Mechanics, optics, thermodynamics — crack JEE Physics together.",
    color: "bg-amber-500/15 text-amber-600",
    activeNow: 312,
  },
  {
    id: "jee-chem",
    name: "JEE Chemistry",
    shortName: "g/JEEChem",
    icon: Atom,
    members: 11300,
    description: "From chemical bonding to electrochemistry — JEE Chemistry hub.",
    color: "bg-cyan-500/15 text-cyan-600",
    activeNow: 198,
  },
  {
    id: "jee-math",
    name: "JEE Math",
    shortName: "g/JEEMath",
    icon: Calculator,
    members: 13700,
    description: "Calculus, algebra, coordinate geometry — JEE Math warriors unite.",
    color: "bg-rose-500/15 text-rose-600",
    activeNow: 267,
  },
  // Subject-based
  {
    id: "mathematics",
    name: "Mathematics",
    shortName: "g/Mathematics",
    icon: Calculator,
    members: 22100,
    description: "Pure & applied math — from algebra to calculus and beyond.",
    color: "bg-blue-500/15 text-blue-600",
    activeNow: 456,
  },
  {
    id: "science",
    name: "Science",
    shortName: "g/Science",
    icon: Microscope,
    members: 19800,
    description: "Physics, chemistry, biology — all sciences under one roof.",
    color: "bg-teal-500/15 text-teal-600",
    activeNow: 389,
  },
  {
    id: "social-science",
    name: "Social Science",
    shortName: "g/SocialScience",
    icon: Globe,
    members: 8900,
    description: "History, geography, political science & economics discussions.",
    color: "bg-indigo-500/15 text-indigo-600",
    activeNow: 145,
  },
  {
    id: "english",
    name: "English",
    shortName: "g/English",
    icon: PenTool,
    members: 14200,
    description: "Literature, grammar, writing skills & language practice.",
    color: "bg-pink-500/15 text-pink-600",
    activeNow: 278,
  },
  {
    id: "commerce",
    name: "Commerce",
    shortName: "g/Commerce",
    icon: TrendingUp,
    members: 11600,
    description: "Accounting, business studies, economics — commerce stream hub.",
    color: "bg-orange-500/15 text-orange-600",
    activeNow: 201,
  },
  {
    id: "computer-science",
    name: "Computer Science",
    shortName: "g/CompSci",
    icon: Code,
    members: 16500,
    description: "Programming, algorithms, data structures & CS fundamentals.",
    color: "bg-violet-500/15 text-violet-600",
    activeNow: 334,
  },
  // Skills & Career
  {
    id: "ui-ux",
    name: "UI/UX Design",
    shortName: "g/UIUX",
    icon: Layers,
    members: 9200,
    description: "Figma, design systems, user research & portfolio building.",
    color: "bg-violet-500/15 text-violet-600",
    activeNow: 178,
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    shortName: "g/Marketing",
    icon: Megaphone,
    members: 7800,
    description: "SEO, social media, paid ads, growth hacks & marketing analytics.",
    color: "bg-orange-500/15 text-orange-600",
    activeNow: 142,
  },
  {
    id: "communication",
    name: "Communication",
    shortName: "g/Comm",
    icon: MessageSquare,
    members: 6400,
    description: "Spoken English, presentation skills, GD/PI prep & confidence building.",
    color: "bg-sky-500/15 text-sky-600",
    activeNow: 119,
  },
  {
    id: "personality-dev",
    name: "Personality Dev",
    shortName: "g/PersonalityDev",
    icon: Star,
    members: 5900,
    description: "Leadership, self-growth, time management & soft skills.",
    color: "bg-yellow-500/15 text-yellow-600",
    activeNow: 97,
  },
  {
    id: "coding",
    name: "Coding",
    shortName: "g/Coding",
    icon: Terminal,
    members: 18300,
    description: "DSA, web dev, Python, competitive programming & projects.",
    color: "bg-green-500/15 text-green-600",
    activeNow: 401,
  },
  // General
  {
    id: "k12-math",
    name: "K12 Math",
    shortName: "g/K12Math",
    icon: BookOpen,
    members: 8200,
    description: "School-level math help — arithmetic to pre-calculus.",
    color: "bg-blue-500/15 text-blue-600",
    activeNow: 145,
  },
  {
    id: "k12-science",
    name: "K12 Science",
    shortName: "g/K12Science",
    icon: Microscope,
    members: 7600,
    description: "Physics, chemistry & biology for school students.",
    color: "bg-teal-500/15 text-teal-600",
    activeNow: 112,
  },
  {
    id: "study-tips",
    name: "Study Tips",
    shortName: "g/StudyTips",
    icon: Brain,
    members: 18500,
    description: "Productivity hacks, study techniques, and motivation for exam prep.",
    color: "bg-orange-500/15 text-orange-600",
    activeNow: 423,
  },
];

// Available icons for custom communities
export const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: "Book", icon: BookOpen },
  { name: "Science", icon: Microscope },
  { name: "Math", icon: Calculator },
  { name: "Brain", icon: Brain },
  { name: "Code", icon: Code },
  { name: "Art", icon: Palette },
  { name: "Globe", icon: Globe },
  { name: "Landmark", icon: Landmark },
  { name: "Pen", icon: PenTool },
  { name: "Trending", icon: TrendingUp },
];

// Available colors for custom communities
export const availableColors = [
  "bg-emerald-500/15 text-emerald-600",
  "bg-purple-500/15 text-purple-600",
  "bg-amber-500/15 text-amber-600",
  "bg-cyan-500/15 text-cyan-600",
  "bg-rose-500/15 text-rose-600",
  "bg-blue-500/15 text-blue-600",
  "bg-teal-500/15 text-teal-600",
  "bg-indigo-500/15 text-indigo-600",
  "bg-pink-500/15 text-pink-600",
  "bg-orange-500/15 text-orange-600",
  "bg-violet-500/15 text-violet-600",
];

// Mutable list that includes user-created communities
let subCommunities: SubCommunity[] = [...defaultCommunities];

export { subCommunities };

export const addCommunity = (community: SubCommunity) => {
  subCommunities = [community, ...subCommunities];
  return subCommunities;
};

export const getCommunityById = (id: string) => subCommunities.find((c) => c.id === id);
export const getCommunityByName = (name: string) => subCommunities.find((c) => c.name === name);

export const formatMembers = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
