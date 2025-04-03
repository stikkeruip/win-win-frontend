// Type for our translations
export type TranslationKey =
    | 'home'
    | 'training'
    | 'media'
    | 'partnership'
    | 'support'
    | 'welcomeTitle'
    | 'welcomeSubtitle'
    | 'welcomeDescription'
    | 'startTraining'
    | 'learnMore'
    | 'whyChooseWinWin'
    | 'platformDesigned'
    | 'resources'
    | 'comprehensive'
    | 'culturallyInclusive'
    | 'globalLearners'
    | 'multilingualContent'
    | 'multilingualDescription'
    | 'structuredLearning'
    | 'structuredDescription'
    | 'communitySupport'
    | 'communityDescription'
    | 'trainingCourses'
    | 'exploreOurCourses'
    | 'filterCourses'
    | 'allCourses'
    | 'coming_soon'
    | 'stay_tuned'
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'weeks';

// Create translations for each language
const translations: Record<string, Record<TranslationKey, string>> = {
    en: {
        home: 'Home',
        training: 'Training',
        media: 'Media',
        partnership: 'Partnership',
        support: 'Support',
        welcomeTitle: 'Welcome to WIN-WIN Training Hub',
        welcomeSubtitle: 'A multilingual educational platform designed to provide training materials and resources across different languages and cultures.',
        welcomeDescription: 'Our hub offers structured learning modules, downloadable resources, and support materials to enhance your skills and knowledge.',
        startTraining: 'Start Training',
        learnMore: 'Learn More',
        whyChooseWinWin: 'Why Choose WIN-WIN?',
        platformDesigned: 'Our platform is designed with students in mind',
        resources: '100+ Resources',
        comprehensive: 'Comprehensive learning materials',
        culturallyInclusive: 'Culturally Inclusive',
        globalLearners: 'Designed for global learners',
        multilingualContent: 'Multilingual Content',
        multilingualDescription: 'Access resources in multiple languages to support diverse learning needs.',
        structuredLearning: 'Structured Learning',
        structuredDescription: 'Follow clear learning paths designed to build your knowledge step by step.',
        communitySupport: 'Community Support',
        communityDescription: 'Connect with peers and instructors for guidance and collaborative learning.',
        trainingCourses: 'Training Courses',
        exploreOurCourses: 'Explore our multilingual courses designed to enhance your skills and knowledge',
        filterCourses: 'Filter Courses',
        allCourses: 'All Courses',
        coming_soon: 'This section is coming soon.',
        stay_tuned: 'Stay tuned for updates!',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        weeks: 'weeks'
    },

    fr: {
        home: 'Accueil',
        training: 'Formation',
        media: 'Médias',
        partnership: 'Partenariat',
        support: 'Support',
        welcomeTitle: 'Bienvenue au Centre de Formation WIN-WIN',
        welcomeSubtitle: 'Une plateforme éducative multilingue conçue pour fournir des matériaux de formation et des ressources dans différentes langues et cultures.',
        welcomeDescription: 'Notre centre propose des modules d\'apprentissage structurés, des ressources téléchargeables et du matériel de soutien pour améliorer vos compétences et connaissances.',
        startTraining: 'Commencer la Formation',
        learnMore: 'En Savoir Plus',
        whyChooseWinWin: 'Pourquoi Choisir WIN-WIN?',
        platformDesigned: 'Notre plateforme est conçue en pensant aux étudiants',
        resources: '100+ Ressources',
        comprehensive: 'Matériaux d\'apprentissage complets',
        culturallyInclusive: 'Culturellement Inclusif',
        globalLearners: 'Conçu pour les apprenants du monde entier',
        multilingualContent: 'Contenu Multilingue',
        multilingualDescription: 'Accédez aux ressources en plusieurs langues pour soutenir divers besoins d\'apprentissage.',
        structuredLearning: 'Apprentissage Structuré',
        structuredDescription: 'Suivez des parcours d\'apprentissage clairs conçus pour construire vos connaissances étape par étape.',
        communitySupport: 'Soutien Communautaire',
        communityDescription: 'Connectez-vous avec des pairs et des instructeurs pour obtenir des conseils et un apprentissage collaboratif.',
        trainingCourses: 'Cours de Formation',
        exploreOurCourses: 'Explorez nos cours multilingues conçus pour améliorer vos compétences et connaissances',
        filterCourses: 'Filtrer les Cours',
        allCourses: 'Tous les Cours',
        coming_soon: 'Cette section sera bientôt disponible.',
        stay_tuned: 'Restez à l\'écoute pour les mises à jour!',
        beginner: 'Débutant',
        intermediate: 'Intermédiaire',
        advanced: 'Avancé',
        weeks: 'semaines'
    },

    ar: {
        home: 'الرئيسية',
        training: 'التدريب',
        media: 'الوسائط',
        partnership: 'الشراكة',
        support: 'الدعم',
        welcomeTitle: 'مرحبًا بكم في مركز تدريب WIN-WIN',
        welcomeSubtitle: 'منصة تعليمية متعددة اللغات مصممة لتوفير مواد تدريبية وموارد بلغات وثقافات مختلفة.',
        welcomeDescription: 'يوفر مركزنا وحدات تعليمية منظمة وموارد قابلة للتنزيل ومواد دعم لتعزيز مهاراتك ومعرفتك.',
        startTraining: 'ابدأ التدريب',
        learnMore: 'معرفة المزيد',
        whyChooseWinWin: 'لماذا تختار WIN-WIN؟',
        platformDesigned: 'تم تصميم منصتنا مع وضع الطلاب في الاعتبار',
        resources: 'أكثر من ١٠٠ مورد',
        comprehensive: 'مواد تعليمية شاملة',
        culturallyInclusive: 'شامل ثقافيًا',
        globalLearners: 'مصمم للمتعلمين العالميين',
        multilingualContent: 'محتوى متعدد اللغات',
        multilingualDescription: 'الوصول إلى الموارد بلغات متعددة لدعم احتياجات التعلم المتنوعة.',
        structuredLearning: 'التعلم المنظم',
        structuredDescription: 'اتبع مسارات تعليمية واضحة مصممة لبناء معرفتك خطوة بخطوة.',
        communitySupport: 'دعم المجتمع',
        communityDescription: 'تواصل مع الزملاء والمدربين للحصول على التوجيه والتعلم التعاوني.',
        trainingCourses: 'دورات تدريبية',
        exploreOurCourses: 'استكشف دوراتنا متعددة اللغات المصممة لتعزيز مهاراتك ومعرفتك',
        filterCourses: 'تصفية الدورات',
        allCourses: 'جميع الدورات',
        coming_soon: 'هذا القسم قادم قريباً.',
        stay_tuned: 'ترقبوا التحديثات!',
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        advanced: 'متقدم',
        weeks: 'أسابيع'
    },

    pt: {
        home: 'Início',
        training: 'Treinamento',
        media: 'Mídia',
        partnership: 'Parceria',
        support: 'Suporte',
        welcomeTitle: 'Bem-vindo ao Centro de Treinamento WIN-WIN',
        welcomeSubtitle: 'Uma plataforma educacional multilíngue projetada para fornecer materiais de treinamento e recursos em diferentes idiomas e culturas.',
        welcomeDescription: 'Nosso centro oferece módulos de aprendizagem estruturados, recursos para download e materiais de suporte para aprimorar suas habilidades e conhecimento.',
        startTraining: 'Iniciar Treinamento',
        learnMore: 'Saiba Mais',
        whyChooseWinWin: 'Por que Escolher WIN-WIN?',
        platformDesigned: 'Nossa plataforma é projetada pensando nos estudantes',
        resources: 'Mais de 100 Recursos',
        comprehensive: 'Materiais de aprendizagem abrangentes',
        culturallyInclusive: 'Culturalmente Inclusivo',
        globalLearners: 'Projetado para estudantes globais',
        multilingualContent: 'Conteúdo Multilíngue',
        multilingualDescription: 'Acesse recursos em vários idiomas para atender diversas necessidades de aprendizagem.',
        structuredLearning: 'Aprendizado Estruturado',
        structuredDescription: 'Siga caminhos de aprendizado claros projetados para construir seu conhecimento passo a passo.',
        communitySupport: 'Suporte Comunitário',
        communityDescription: 'Conecte-se com colegas e instrutores para obter orientação e aprendizado colaborativo.',
        trainingCourses: 'Cursos de Treinamento',
        exploreOurCourses: 'Explore nossos cursos multilíngues projetados para aprimorar suas habilidades e conhecimento',
        filterCourses: 'Filtrar Cursos',
        allCourses: 'Todos os Cursos',
        coming_soon: 'Esta seção estará disponível em breve.',
        stay_tuned: 'Fique atento para atualizações!',
        beginner: 'Iniciante',
        intermediate: 'Intermediário',
        advanced: 'Avançado',
        weeks: 'semanas'
    }
};

// Helper function to get translations for a specific language
export function getTranslations(lang: string = 'en') {
    // Default to English if the language isn't supported
    return translations[lang] || translations['en'];
}