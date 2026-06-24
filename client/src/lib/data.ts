// Static data for the frontend

export const siteConfig = {
  name: "Nepalaya Educational Foundation",
  shortName: "Nepalaya",
  tagline: "Excellence in Education Since 1984 AD",
  description: "Nepal's premier institution fostering global leaders through innovative education and rich cultural heritage.",
  contact: {
    address: "Kalanki 14, Kathmandu 44600",
    city: "Kathmandu, Nepal",
    phone: "+977-9761522442",
    email: "info@nepalayaedufoundation.edu.np"
  },
  social: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com"
  }
};

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Admissions", href: "/admissions" },
  { name: "Faculty", href: "/faculty" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export const programs = [
  {
    id: "p1",
    title: "Science & Technology",
    icon: "microscope",
    level: "Bachelor's / Master's",
    description: "Cutting-edge programs in computer science, physics, and environmental sciences.",
    color: "from-blue-500/20 to-blue-600/5",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p2",
    title: "Business Management",
    icon: "briefcase",
    level: "BBA / MBA",
    description: "Developing future business leaders with global perspectives and ethical grounding.",
    color: "from-amber-500/20 to-amber-600/5",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p3",
    title: "Humanities & Arts",
    icon: "book-open",
    level: "Bachelor's / Master's",
    description: "Exploring the depth of human culture, languages, and societal structures.",
    color: "from-blue-500/20 to-sky-500/5",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p4",
    title: "Engineering",
    icon: "cpu",
    level: "BE / ME",
    description: "Rigorous training in civil, computer, and mechanical engineering disciplines.",
    color: "from-rose-500/20 to-rose-600/5",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p5",
    title: "Law & Justice",
    icon: "scale",
    level: "BA.LLB / LLM",
    description: "Comprehensive legal education focusing on national and international law.",
    color: "from-blue-500/20 to-blue-600/5",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p6",
    title: "Medical Sciences",
    icon: "stethoscope",
    level: "MBBS / MD",
    description: "Premier medical training affiliated with leading national hospitals.",
    color: "from-teal-500/20 to-teal-600/5",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
  }
];

export const faculty = [
  {
    id: "f1",
    name: "Dr. Rajesh Shrestha",
    designation: "Dean of Engineering",
    department: "Engineering",
    education: "Ph.D. MIT",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f2",
    name: "Prof. Anjali Sharma",
    designation: "Head of Humanities",
    department: "Humanities & Arts",
    education: "Ph.D. Oxford",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f3",
    name: "Dr. Bimal Karki",
    designation: "Associate Professor",
    department: "Science & Technology",
    education: "Ph.D. Tribhuvan University",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "f4",
    name: "Dr. Sunita Maharjan",
    designation: "Director of MBA",
    department: "Business Management",
    education: "Ph.D. Harvard",
    image: "https://images.unsplash.com/photo-1580820267682-426da823d514?auto=format&fit=crop&q=80&w=400"
  }
];

export const news = [
  {
    id: "n1",
    title: "Nepalaya Hosts International Tech Symposium 2025",
    date: "15 Mangsir 2081",
    category: "Events",
    summary: "Over 500 delegates from across Asia gathered at our Kalanki 14 campus for the annual technology innovation symposium.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "n2",
    title: "New AI Research Lab Inaugurated",
    date: "02 Mangsir 2081",
    category: "Academic",
    summary: "The state-of-the-art artificial intelligence laboratory opens to provide master's students with cutting-edge compute resources.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "n3",
    title: "Alumni Association Announces Scholarship Fund",
    date: "28 Kartik 2081",
    category: "Alumni",
    summary: "A new fund of Rs. 50 Lakhs has been established to support meritorious students from rural areas of Nepal.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
  }
];
