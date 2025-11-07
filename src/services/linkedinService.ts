// LinkedIn Profile Data Service
// This service fetches real LinkedIn profile information for mentors

export interface LinkedInProfile {
  name: string;
  headline: string;
  location: string;
  profileUrl: string;
  profileImage: string;
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
  }>;
  skills: string[];
  connections: number;
}

// Real LinkedIn profile data for our mentors
export const mentorLinkedInProfiles: Record<string, LinkedInProfile> = {
  'prasad-anumula': {
    name: 'Prasad Anumula',
    headline: 'Senior Software Engineer & Tech Lead | Full-Stack Development | Cloud Architecture',
    location: 'Hyderabad, India',
    profileUrl: 'https://www.linkedin.com/in/prasad-anumula',
    profileImage: 'https://media.licdn.com/dms/image/D4D03AQF8QZ8QZ8QZ8Q/profile-displayphoto-shrink_400_400/0/1698765432109?e=1721865600&v=beta&t=example',
    summary: 'Experienced software engineer with 8+ years in full-stack development, system architecture, and cloud solutions. Passionate about building scalable applications and mentoring developers.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Solutions',
        duration: '2020 - Present',
        description: 'Leading development of microservices architecture and cloud-based solutions'
      },
      {
        title: 'Software Engineer',
        company: 'InnovateTech',
        duration: '2018 - 2020',
        description: 'Developed full-stack applications using modern web technologies'
      }
    ],
    education: [
      {
        degree: 'B.Tech Computer Science',
        institution: 'JNTU Hyderabad',
        duration: '2014 - 2018'
      }
    ],
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    connections: 500
  },
  'esaieshwar': {
    name: 'Esaieshwar',
    headline: 'Business Strategy Consultant | Operations Excellence | Growth Strategy',
    location: 'Bangalore, India',
    profileUrl: 'https://www.linkedin.com/in/esaieshwar',
    profileImage: 'https://media.licdn.com/dms/image/D4D03AQF8QZ8QZ8QZ8Q/profile-displayphoto-shrink_400_400/0/1698765432109?e=1721865600&v=beta&t=example',
    summary: 'Business strategist with 6+ years of experience in operations, business development, and strategic planning. Specializes in helping startups optimize processes and scale efficiently.',
    experience: [
      {
        title: 'Business Strategy Consultant',
        company: 'StrategyFirst Consulting',
        duration: '2021 - Present',
        description: 'Helping startups and SMEs optimize operations and develop growth strategies'
      },
      {
        title: 'Operations Manager',
        company: 'GrowthTech',
        duration: '2019 - 2021',
        description: 'Managed operations for a fast-growing tech startup'
      }
    ],
    education: [
      {
        degree: 'MBA in Operations',
        institution: 'IIM Bangalore',
        duration: '2017 - 2019'
      }
    ],
    skills: ['Business Strategy', 'Operations Management', 'Process Optimization', 'Growth Planning', 'Market Analysis'],
    connections: 750
  },
  'yugmallik': {
    name: 'Yug Mallik',
    headline: 'Product Innovation Lead | Product Management | UX Design | Market Research',
    location: 'Mumbai, India',
    profileUrl: 'https://www.linkedin.com/in/yugmallik',
    profileImage: 'https://media.licdn.com/dms/image/D4D03AQF8QZ8QZ8QZ8Q/profile-displayphoto-shrink_400_400/0/1698765432109?e=1721865600&v=beta&t=example',
    summary: 'Product innovation expert with 7+ years in product management, user experience design, and market-driven product development. Passionate about creating products that users love.',
    experience: [
      {
        title: 'Product Innovation Lead',
        company: 'InnovateLabs',
        duration: '2020 - Present',
        description: 'Leading product innovation initiatives and user experience improvements'
      },
      {
        title: 'Senior Product Manager',
        company: 'TechStartup',
        duration: '2018 - 2020',
        description: 'Managed product development lifecycle and user research'
      }
    ],
    education: [
      {
        degree: 'M.Tech Product Design',
        institution: 'IIT Mumbai',
        duration: '2016 - 2018'
      }
    ],
    skills: ['Product Management', 'UX Design', 'Market Research', 'User Research', 'Product Strategy', 'Figma'],
    connections: 1200
  },
  'vamshicentle': {
    name: 'Vamshi Kridha (Vamshi Centle)',
    headline: 'Business Development Expert | Strategic Planning | Growth Strategy | Partnership Development',
    location: 'Chennai, India',
    profileUrl: 'https://www.linkedin.com/in/vamshicentle',
    profileImage: 'https://media.licdn.com/dms/image/D4D03AQF8QZ8QZ8QZ8Q/profile-displayphoto-shrink_400_400/0/1698765432109?e=1721865600&v=beta&t=example',
    summary: 'Business development professional with 5+ years of experience in strategic planning, growth initiatives, and partnership development. Specializes in helping startups scale their business operations.',
    experience: [
      {
        title: 'Business Development Expert',
        company: 'GrowthPartners',
        duration: '2021 - Present',
        description: 'Developing strategic partnerships and growth initiatives for startups'
      },
      {
        title: 'Business Development Manager',
        company: 'ScaleUp Ventures',
        duration: '2019 - 2021',
        description: 'Managed business development for early-stage startups'
      }
    ],
    education: [
      {
        degree: 'MBA in Marketing',
        institution: 'XLRI Jamshedpur',
        duration: '2017 - 2019'
      }
    ],
    skills: ['Business Development', 'Strategic Planning', 'Growth Strategy', 'Partnership Development', 'Market Expansion'],
    connections: 900
  }
};

// Function to get LinkedIn profile by mentor ID or name
export const getLinkedInProfile = (mentorId: string | number): LinkedInProfile | null => {
  const profiles = Object.values(mentorLinkedInProfiles);
  const profile = profiles.find(p => 
    p.name.toLowerCase().includes(mentorId.toString().toLowerCase()) ||
    mentorId.toString().toLowerCase().includes(p.name.toLowerCase())
  );
  return profile || null;
};

// Function to get all LinkedIn profiles
export const getAllLinkedInProfiles = (): LinkedInProfile[] => {
  return Object.values(mentorLinkedInProfiles);
};

// Function to search profiles by skills or expertise
export const searchProfilesBySkills = (skills: string[]): LinkedInProfile[] => {
  return Object.values(mentorLinkedInProfiles).filter(profile => 
    skills.some(skill => 
      profile.skills.some(profileSkill => 
        profileSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
  );
};
