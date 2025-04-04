// lib/translations.ts (complete updated version)
// Update the TranslationKey type to include the new keys
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
    | 'weeks'
    // Course detail page translations
    | 'availableLanguages'
    | 'downloadMaterials'
    | 'startCourse'
    | 'browseOtherCourses'
    | 'courseDetails'
    | 'language'
    | 'level'
    | 'lastUpdated'
    // Admin section translations
    | 'admin_dashboard'
    | 'admin_content'
    | 'admin_upload'
    | 'admin_stats'
    | 'admin_languages'
    | 'admin_logout'
    | 'admin_quickActions'
    | 'admin_createNewContent'
    | 'admin_uploadFiles'
    | 'admin_manageContent'
    | 'admin_recentContent'
    | 'admin_totalContent'
    | 'admin_totalLanguages'
    | 'admin_totalVisits'
    | 'admin_viewAllContent'
    | 'admin_title'
    | 'admin_description'
    | 'admin_noContent'
    | 'admin_date'
    | 'admin_edit'
    | 'admin_delete'
    | 'admin_actions'
    | 'admin_save'
    | 'admin_cancel'
    | 'admin_back'
    | 'admin_loading'
    | 'admin_error'
    | 'admin_success'
    | 'admin_filter'
    | 'admin_search'
    | 'admin_allLanguages'
    | 'admin_allTypes'
    | 'admin_contentManagement'
    | 'admin_statistics'
    | 'admin_languageManagement'
    | 'admin_multilingualSupport'
    | 'admin_bestPractices'
    | 'admin_translations'
    | 'admin_addTranslation'
    | 'admin_noTranslations'
    | 'admin_file'
    | 'admin_fileUpload'
    | 'admin_uploadAFile'
    | 'admin_contentType'
    | 'admin_original'
    | 'admin_translation'
    | 'admin_loggingIn'
    | 'admin_signIn'
    | 'admin_username'
    | 'admin_password'
    | 'admin_loginError'
    | 'admin_loginDescription';

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
        weeks: 'weeks',
        // Course detail page translations
        availableLanguages: 'Available Languages',
        downloadMaterials: 'Download Materials',
        startCourse: 'Start Course',
        browseOtherCourses: 'Browse Other Courses',
        courseDetails: 'Course Details',
        language: 'Language',
        level: 'Level',
        lastUpdated: 'Last Updated',

        // Admin translations
        admin_dashboard: 'Dashboard',
        admin_content: 'Content',
        admin_upload: 'Upload',
        admin_stats: 'Statistics',
        admin_languages: 'Languages',
        admin_logout: 'Logout',
        admin_quickActions: 'Quick Actions',
        admin_createNewContent: 'Create New Content',
        admin_uploadFiles: 'Upload Files',
        admin_manageContent: 'Manage Content',
        admin_recentContent: 'Recent Content',
        admin_totalContent: 'Total Content',
        admin_totalLanguages: 'Languages',
        admin_totalVisits: 'Total Visits',
        admin_viewAllContent: 'View all content',
        admin_title: 'Title',
        admin_description: 'Description',
        admin_noContent: 'No content available',
        admin_date: 'Date',
        admin_edit: 'Edit',
        admin_delete: 'Delete',
        admin_actions: 'Actions',
        admin_save: 'Save',
        admin_cancel: 'Cancel',
        admin_back: 'Back to List',
        admin_loading: 'Loading...',
        admin_error: 'Error',
        admin_success: 'Success',
        admin_filter: 'Filter',
        admin_search: 'Search',
        admin_allLanguages: 'All Languages',
        admin_allTypes: 'All Types',
        admin_contentManagement: 'Content Management',
        admin_statistics: 'Statistics',
        admin_languageManagement: 'Language Management',
        admin_multilingualSupport: 'Multilingual Support',
        admin_bestPractices: 'Best Practices',
        admin_translations: 'Translations',
        admin_addTranslation: 'Add Translation',
        admin_noTranslations: 'No translations',
        admin_file: 'File',
        admin_fileUpload: 'File Upload',
        admin_uploadAFile: 'Upload a file',
        admin_contentType: 'Content Type',
        admin_original: 'Original',
        admin_translation: 'Translation',
        admin_loggingIn: 'Logging in...',
        admin_signIn: 'Sign in',
        admin_username: 'Username',
        admin_password: 'Password',
        admin_loginError: 'Login Error',
        admin_loginDescription: 'Login to access the content management system'
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
        weeks: 'semaines',
        availableLanguages: 'Langues Disponibles',
        downloadMaterials: 'Télécharger les Matériaux',
        startCourse: 'Commencer le Cours',
        browseOtherCourses: 'Explorer D\'autres Cours',
        courseDetails: 'Détails du Cours',
        language: 'Langue',
        level: 'Niveau',
        lastUpdated: 'Dernière Mise à Jour',

        // Admin translations
        admin_dashboard: 'Tableau de Bord',
        admin_content: 'Contenu',
        admin_upload: 'Télécharger',
        admin_stats: 'Statistiques',
        admin_languages: 'Langues',
        admin_logout: 'Déconnexion',
        admin_quickActions: 'Actions Rapides',
        admin_createNewContent: 'Créer du Nouveau Contenu',
        admin_uploadFiles: 'Télécharger des Fichiers',
        admin_manageContent: 'Gérer le Contenu',
        admin_recentContent: 'Contenu Récent',
        admin_totalContent: 'Contenu Total',
        admin_totalLanguages: 'Langues',
        admin_totalVisits: 'Visites Totales',
        admin_viewAllContent: 'Voir tout le contenu',
        admin_title: 'Titre',
        admin_description: 'Description',
        admin_noContent: 'Aucun contenu disponible',
        admin_date: 'Date',
        admin_edit: 'Modifier',
        admin_delete: 'Supprimer',
        admin_actions: 'Actions',
        admin_save: 'Enregistrer',
        admin_cancel: 'Annuler',
        admin_back: 'Retour à la Liste',
        admin_loading: 'Chargement...',
        admin_error: 'Erreur',
        admin_success: 'Succès',
        admin_filter: 'Filtrer',
        admin_search: 'Rechercher',
        admin_allLanguages: 'Toutes les Langues',
        admin_allTypes: 'Tous les Types',
        admin_contentManagement: 'Gestion du Contenu',
        admin_statistics: 'Statistiques',
        admin_languageManagement: 'Gestion des Langues',
        admin_multilingualSupport: 'Support Multilingue',
        admin_bestPractices: 'Meilleures Pratiques',
        admin_translations: 'Traductions',
        admin_addTranslation: 'Ajouter une Traduction',
        admin_noTranslations: 'Pas de traductions',
        admin_file: 'Fichier',
        admin_fileUpload: 'Téléchargement de Fichier',
        admin_uploadAFile: 'Télécharger un fichier',
        admin_contentType: 'Type de Contenu',
        admin_original: 'Original',
        admin_translation: 'Traduction',
        admin_loggingIn: 'Connexion en cours...',
        admin_signIn: 'Se connecter',
        admin_username: 'Nom d\'utilisateur',
        admin_password: 'Mot de passe',
        admin_loginError: 'Erreur de connexion',
        admin_loginDescription: 'Connectez-vous pour accéder au système de gestion de contenu'
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
        weeks: 'semanas',
        availableLanguages: 'Idiomas Disponíveis',
        downloadMaterials: 'Baixar Materiais',
        startCourse: 'Iniciar Curso',
        browseOtherCourses: 'Navegar por Outros Cursos',
        courseDetails: 'Detalhes do Curso',
        language: 'Idioma',
        level: 'Nível',
        lastUpdated: 'Última Atualização',

        // Admin translations
        admin_dashboard: 'Painel de Controle',
        admin_content: 'Conteúdo',
        admin_upload: 'Upload',
        admin_stats: 'Estatísticas',
        admin_languages: 'Idiomas',
        admin_logout: 'Sair',
        admin_quickActions: 'Ações Rápidas',
        admin_createNewContent: 'Criar Novo Conteúdo',
        admin_uploadFiles: 'Fazer Upload de Arquivos',
        admin_manageContent: 'Gerenciar Conteúdo',
        admin_recentContent: 'Conteúdo Recente',
        admin_totalContent: 'Total de Conteúdo',
        admin_totalLanguages: 'Idiomas',
        admin_totalVisits: 'Total de Visitas',
        admin_viewAllContent: 'Ver todo o conteúdo',
        admin_title: 'Título',
        admin_description: 'Descrição',
        admin_noContent: 'Nenhum conteúdo disponível',
        admin_date: 'Data',
        admin_edit: 'Editar',
        admin_delete: 'Excluir',
        admin_actions: 'Ações',
        admin_save: 'Salvar',
        admin_cancel: 'Cancelar',
        admin_back: 'Voltar para a Lista',
        admin_loading: 'Carregando...',
        admin_error: 'Erro',
        admin_success: 'Sucesso',
        admin_filter: 'Filtrar',
        admin_search: 'Pesquisar',
        admin_allLanguages: 'Todos os Idiomas',
        admin_allTypes: 'Todos os Tipos',
        admin_contentManagement: 'Gerenciamento de Conteúdo',
        admin_statistics: 'Estatísticas',
        admin_languageManagement: 'Gerenciamento de Idiomas',
        admin_multilingualSupport: 'Suporte Multilíngue',
        admin_bestPractices: 'Melhores Práticas',
        admin_translations: 'Traduções',
        admin_addTranslation: 'Adicionar Tradução',
        admin_noTranslations: 'Sem traduções',
        admin_file: 'Arquivo',
        admin_fileUpload: 'Upload de Arquivo',
        admin_uploadAFile: 'Fazer upload de um arquivo',
        admin_contentType: 'Tipo de Conteúdo',
        admin_original: 'Original',
        admin_translation: 'Tradução',
        admin_loggingIn: 'Entrando...',
        admin_signIn: 'Entrar',
        admin_username: 'Nome de usuário',
        admin_password: 'Senha',
        admin_loginError: 'Erro de login',
        admin_loginDescription: 'Faça login para acessar o sistema de gerenciamento de conteúdo'
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
        weeks: 'أسابيع',
        availableLanguages: 'اللغات المتوفرة',
        downloadMaterials: 'تنزيل المواد',
        startCourse: 'ابدأ الدورة',
        browseOtherCourses: 'تصفح الدورات الأخرى',
        courseDetails: 'تفاصيل الدورة',
        language: 'اللغة',
        level: 'المستوى',
        lastUpdated: 'آخر تحديث',

        // Admin translations
        admin_dashboard: 'لوحة التحكم',
        admin_content: 'المحتوى',
        admin_upload: 'رفع',
        admin_stats: 'الإحصائيات',
        admin_languages: 'اللغات',
        admin_logout: 'تسجيل الخروج',
        admin_quickActions: 'إجراءات سريعة',
        admin_createNewContent: 'إنشاء محتوى جديد',
        admin_uploadFiles: 'رفع الملفات',
        admin_manageContent: 'إدارة المحتوى',
        admin_recentContent: 'المحتوى الحديث',
        admin_totalContent: 'إجمالي المحتوى',
        admin_totalLanguages: 'اللغات',
        admin_totalVisits: 'إجمالي الزيارات',
        admin_viewAllContent: 'عرض كل المحتوى',
        admin_title: 'العنوان',
        admin_description: 'الوصف',
        admin_noContent: 'لا يوجد محتوى متاح',
        admin_date: 'التاريخ',
        admin_edit: 'تعديل',
        admin_delete: 'حذف',
        admin_actions: 'الإجراءات',
        admin_save: 'حفظ',
        admin_cancel: 'إلغاء',
        admin_back: 'العودة إلى القائمة',
        admin_loading: 'جاري التحميل...',
        admin_error: 'خطأ',
        admin_success: 'نجاح',
        admin_filter: 'تصفية',
        admin_search: 'بحث',
        admin_allLanguages: 'كل اللغات',
        admin_allTypes: 'كل الأنواع',
        admin_contentManagement: 'إدارة المحتوى',
        admin_statistics: 'الإحصائيات',
        admin_languageManagement: 'إدارة اللغات',
        admin_multilingualSupport: 'دعم متعدد اللغات',
        admin_bestPractices: 'أفضل الممارسات',
        admin_translations: 'الترجمات',
        admin_addTranslation: 'إضافة ترجمة',
        admin_noTranslations: 'لا توجد ترجمات',
        admin_file: 'ملف',
        admin_fileUpload: 'رفع ملف',
        admin_uploadAFile: 'رفع ملف',
        admin_contentType: 'نوع المحتوى',
        admin_original: 'أصلي',
        admin_translation: 'ترجمة',
        admin_loggingIn: 'جاري تسجيل الدخول...',
        admin_signIn: 'تسجيل الدخول',
        admin_username: 'اسم المستخدم',
        admin_password: 'كلمة المرور',
        admin_loginError: 'خطأ في تسجيل الدخول',
        admin_loginDescription: 'تسجيل الدخول للوصول إلى نظام إدارة المحتوى',
    }
}