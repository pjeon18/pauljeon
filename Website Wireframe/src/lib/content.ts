import content from '../../content/copy.json';

export interface Content {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    social: {
      email: string;
      github: string;
      linkedin: string;
      twitter: string;
      dribbble: string;
    };
  };
  pages: {
    home: {
      hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
      };
      about: {
        title: string;
        description: string;
        highlight: string;
      };
    };
    work: {
      title: string;
      subtitle: string;
      description: string;
    };
    about: {
      title: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
      skills: Array<{
        category: string;
        items: string[];
      }>;
    };
    contact: {
      title: string;
      subtitle: string;
      description: string;
      email: {
        label: string;
        value: string;
        link: string;
      };
      form: {
        name: { label: string; placeholder: string };
        email: { label: string; placeholder: string };
        message: { label: string; placeholder: string };
        submit: string;
      };
    };
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    year: string;
    tags: string[];
    image: string;
    link: string;
  }>;
}

export default content as Content;

