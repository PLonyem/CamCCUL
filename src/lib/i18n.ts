// Translation dictionary for the CamCCUL website.
//
// Scope note: this file covers every string rendered by the Navbar, Footer,
// Chatbot, and the homepage (the fully-wired i18n example), plus the shared
// service names reused across those surfaces. It intentionally does NOT
// translate mock-data.ts placeholder content (news articles, leadership
// bios, affiliate names) — that content is bracketed "[to be provided]"
// filler, not real copy, and translating it would mean restructuring
// mock-data.ts into a language-aware shape, which is a separate task from
// adding a translation layer. See the chat response for the page-by-page
// rollout pattern.

const en = {
  // ─── Navbar ───────────────────────────────────────────────────────────
  nav_home: "Home",
  nav_about: "About",
  nav_services: "Services",
  nav_affiliates: "Affiliates",
  nav_resources: "Resources",
  nav_news: "News",
  nav_faq: "FAQ",
  nav_contact: "Contact",
  nav_services_regulatory: "Regulatory Supervision",
  nav_services_auditing: "Financial Auditing",
  nav_services_capacity: "Capacity Building",
  nav_services_digitalization: "Digitalization of Credit Unions",
  nav_tagline: "Cameroon Cooperative Credit Union League",
  nav_affiliates_all_regions: "All Regions",
  nav_language_aria: "Change language",
  nav_menu_open_aria: "Toggle menu",
  nav_menu_close_aria: "Close menu",
  nav_services_toggle_aria: "Toggle services",
  nav_regions_toggle_aria: "Toggle regions",

  // ─── Footer ───────────────────────────────────────────────────────────
  footer_tagline: "Cameroon Cooperative Credit Union League",
  footer_about:
    "Supervising and empowering cooperative credit unions across Cameroon since 1968.",
  footer_quick_links: "Quick Links",
  footer_resources: "Resources",
  footer_contact: "Contact Us",
  footer_copyright: "© 2026 CamCCUL. All rights reserved.",
  footer_privacy: "Privacy Policy",
  footer_terms: "Terms of Service",
  footer_security: "Security",
  footer_link_home: "Home",
  footer_link_about: "About Us",
  footer_link_services: "Services",
  footer_link_affiliates: "Affiliates",
  footer_link_resources: "Resources",
  footer_link_news: "News",
  footer_link_contact: "Contact",
  footer_resource_cobac: "COBAC Regulations",
  footer_resource_training: "Training Materials",
  footer_resource_faq: "FAQ",
  footer_follow_us: "Follow Us",

  // ─── Homepage ─────────────────────────────────────────────────────────
  home_hero_badge: "Regulated by COBAC",
  home_hero_title: "Supervising 220+ Credit Unions Across Cameroon",
  home_hero_subtitle:
    "Empowering financial inclusion through transparent regulation, modern technology, and capacity building for cooperative credit unions since 1968.",
  home_hero_button: "Explore Our Services",
  home_glance_title: "League at a Glance",
  home_glance_affiliates_label: "Affiliated Credit Unions",
  home_glance_affiliates_trend: "Live count from directory",
  home_glance_regions_label: "Regions Covered",
  home_glance_regions_trend: "All of Cameroon",
  home_glance_years_label: "Years of Service",
  home_glance_years_trend: "Since 1968",
  home_glance_members_label: "Members Served",
  home_glance_members_trend: "[Data pending]",
  home_trust_title: "Recognized & Regulated By",
  home_trust_mof: "Ministry of Finance",
  home_mission_title: "Our Mission",
  home_mission_placeholder:
    "CamCCUL's mission statement will appear here. This placeholder text demonstrates the layout and formatting of the mission section. The official mission statement will be provided by the League's communications department.",
  home_mission_card_financial_inclusion: "Financial Inclusion",
  home_mission_card_placeholder:
    "[Service description to be provided by CamCCUL. This placeholder demonstrates the services section layout.]",
  home_services_title: "What We Do",
  home_service_regulatory_desc:
    "As the apex supervisory body for cooperative credit unions in Cameroon, CamCCUL is responsible for ensuring that every affiliate operates in compliance with COBAC regulations and international best practices. Our supervision framework is designed to protect member deposits, maintain financial stability, and promote confidence in the cooperative financial sector.",
  home_service_auditing_desc:
    "Financial auditing is the cornerstone of trust in the cooperative credit union movement. At CamCCUL, our audit team conducts thorough, independent examinations of every affiliate's financial statements, internal controls, and operational procedures. Our audits provide assurance to members, regulators, and partners that credit union funds are managed responsibly and transparently.",
  home_service_capacity_desc:
    "CamCCUL offers robust capacity building training for its affiliate credit unions, equipping staff with essential skills and knowledge to manage their institutions effectively.",
  home_service_digitalization_desc:
    "Spearheading the digitalization of our 220 affiliate credit unions, streamlining operations and enhancing service delivery through innovative technology.",
  home_learn_more: "Learn more",
  home_affiliates_title: "Our Reach Across Cameroon",
  home_affiliates_subtitle:
    "Affiliated credit unions organized across all 10 regions of Cameroon.",
  home_stat_regions: "Regions",
  home_stat_unions: "Unions",
  home_stat_members: "Members",
  home_stat_assets: "Assets",
  home_find_cu_button: "Find a Credit Union Near You",
  home_news_title: "Latest News & Updates",
  home_view_all: "View All",
  home_faq_title: "Have Questions?",
  home_faq_subtitle:
    "Find answers to common questions about CamCCUL, credit unions, and our services.",
  home_faq_button: "View FAQs",
  home_connect_title: "Connect With Us",
  home_connect_subtitle:
    "Follow CamCCUL on Facebook for the latest updates, event photos, and community stories.",
  home_connect_handle: "Follow us @CamCCUL",
  home_connect_description:
    "Get real-time updates on League activities, training sessions, AGM coverage, and stories from credit unions across Cameroon.",
  home_connect_button: "Follow CamCCUL on Facebook",
  home_connect_note: "Opens in a new tab",

  // ─── FAQ page ─────────────────────────────────────────────────────────
  faq_page_title: "Frequently Asked Questions",

  // ─── About page ───────────────────────────────────────────────────────
  about_page_title: "About CamCCUL",
  about_history_title: "Our History",
  about_history_subtitle:
    "A legacy of service to Cameroon's cooperative credit unions since 1968.",
  about_mission_vision_title: "Our Mission & Vision",
  about_mission_vision_subtitle:
    "Guiding principles that drive our work across all 10 regions of Cameroon.",
  about_mission_title: "Our Mission",
  about_vision_title: "Our Vision",
  about_leadership_title: "Board of Directors",
  about_leadership_subtitle:
    "The dedicated leadership guiding CamCCUL's strategic direction.",
  about_presence_title: "Our Presence Across Cameroon",
  about_presence_subtitle:
    "220+ affiliate credit unions serving members in every region of the country.",
  about_presence_paragraph:
    "CamCCUL operates as the umbrella body for affiliated credit unions organized across all ten regions of Cameroon. Each affiliate operates independently within its community while adhering to the regulatory, reporting, and capacity-building standards set by the League, allowing members nationwide to access consistent, cooperative financial services close to home.",
  about_milestone_present: "Present",

  // ─── Affiliates page ──────────────────────────────────────────────────
  affiliates_page_title: "Our Affiliate Credit Unions",
  affiliates_page_subtitle: "Select a region to view its affiliated credit unions",
  affiliates_select_title: "Find Credit Unions in Your Region",
  affiliates_select_description:
    "Select a region from the dropdown below to view all affiliated credit unions in that area.",
  affiliates_select_placeholder: "— Select a Region —",
  affiliates_region_label: "Region:",
  affiliates_total_label: "Total Credit Unions:",
  affiliates_change_region: "Change Region",
  affiliates_empty_title: "No credit unions found in this region.",
  affiliates_empty_subtitle: "Please select a different region.",

  // ─── Contact page ─────────────────────────────────────────────────────
  contact_page_title: "Contact Us",
  contact_page_subtitle:
    "We'd love to hear from you. Reach out to the League headquarters or your regional office.",
  contact_thank_you: "Thank You!",
  contact_thank_you_message:
    "Your message has been received. We'll respond within 2 business days.",
  contact_send_another: "Send Another Message",
  contact_error_message: "Something went wrong. Please try again.",
  contact_label_name: "Name",
  contact_label_email: "Email",
  contact_label_subject: "Subject",
  contact_label_message: "Message",
  contact_sending: "Sending...",
  contact_send_message: "Send Message",
  contact_info_title: "Contact Information",
  contact_label_address: "Address",
  contact_label_phone: "Phone",
  contact_label_office_hours: "Office Hours",
  contact_regional_offices_title: "Regional Offices",
  contact_regional_offices_text:
    "CamCCUL maintains regional offices in all 10 regions. Contact the headquarters for regional office information.",
  contact_follow_us_online: "Follow Us Online",
  contact_facebook_link_text: "CamCCUL on Facebook",
  contact_validation_name: "Name must be at least 2 characters.",
  contact_validation_email: "Enter a valid email address.",
  contact_validation_subject: "Subject must be at least 5 characters.",
  contact_validation_message: "Message must be at least 10 characters.",

  // ─── News page ────────────────────────────────────────────────────────
  news_page_title: "News & Circulars",
  news_page_subtitle: "Stay informed with the latest updates from CamCCUL.",
  news_category_all: "All",
  news_read_more: "Read More →",
  news_read_more_cta: "Read More",
  news_previous: "Previous",
  news_next: "Next",
  news_page_label: "Page",
  news_of_label: "of",
  news_empty_title: "No articles in this category.",
  news_empty_subtitle: "Select a different category to view more.",

  // ─── Resources page ───────────────────────────────────────────────────
  resources_page_title: "Resources & Downloads",
  resources_page_subtitle:
    "Access COBAC templates, training materials, and regulatory documents.",
  resources_tab_templates: "Reporting Templates",
  resources_tab_cobac: "COBAC Regulations",
  resources_tab_training: "Training Materials",
  resources_tab_forms: "Forms",
  resources_download: "Download",
  resources_empty_title: "No resources in this category yet.",
  resources_empty_subtitle: "Check back soon for new uploads.",

  // ─── Services index page ──────────────────────────────────────────────
  services_page_title: "Our Services",
  services_page_subtitle:
    "CamCCUL supports its 220+ affiliate credit unions through four core services: regulatory supervision, financial auditing, capacity building, and digitalization.",
  services_learn_more: "Learn more",

  // ─── Services detail pages (hero subtitles) ──────────────────────────
  service_regulatory_subtitle:
    "Ensuring compliance and financial stability across all 220 affiliate credit unions.",
  service_auditing_subtitle:
    "Independent, rigorous audits ensuring transparency and accountability across all affiliate credit unions.",
  service_capacity_subtitle:
    "Equipping credit union staff with essential skills, knowledge, and tools for operational excellence.",
  service_digitalization_subtitle:
    "Transforming operations and service delivery through innovative technology across all 220 affiliate credit unions.",

  // ─── Not found / loading ──────────────────────────────────────────────
  notfound_title: "Page Not Found",
  notfound_message:
    "The page you're looking for doesn't exist or may have been moved. Please check the URL or return to the homepage.",
  notfound_back_home: "Back to Home",
  loading_text: "Loading...",

  // ─── Chatbot ──────────────────────────────────────────────────────────
  chatbot_assistant_name: "CamCCUL Assistant",
  chatbot_placeholder: "Type your question...",
  chatbot_welcome:
    "Hello! 👋 I'm the CamCCUL virtual assistant. I can help you with questions about the League, finding a credit union near you, our services, or how to get in touch. What would you like to know?",
  chatbot_typing: "Typing...",
  chatbot_open_aria: "Open chat assistant",
  chatbot_close_aria: "Close chat assistant",
  chatbot_input_aria: "Type your message",
  chatbot_send_aria: "Send message",
  chatbot_error:
    "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach CamCCUL directly at +237 233 36 11 82 or info@camccul.cm.",
} as const;

const fr: Record<keyof typeof en, string> = {
  // ─── Navbar ───────────────────────────────────────────────────────────
  nav_home: "Accueil",
  nav_about: "À propos",
  nav_services: "Services",
  nav_affiliates: "Affiliés",
  nav_resources: "Ressources",
  nav_news: "Actualités",
  nav_faq: "FAQ",
  nav_contact: "Contact",
  nav_services_regulatory: "Supervision Réglementaire",
  nav_services_auditing: "Audit Financier",
  nav_services_capacity: "Renforcement des Capacités",
  nav_services_digitalization: "Digitalisation des Coopératives",
  nav_tagline: "Ligue des Coopératives de Crédit du Cameroun",
  nav_affiliates_all_regions: "Toutes les Régions",
  nav_language_aria: "Changer de langue",
  nav_menu_open_aria: "Basculer le menu",
  nav_menu_close_aria: "Fermer le menu",
  nav_services_toggle_aria: "Basculer les services",
  nav_regions_toggle_aria: "Basculer les régions",

  // ─── Footer ───────────────────────────────────────────────────────────
  footer_tagline: "Ligue des Coopératives de Crédit du Cameroun",
  footer_about:
    "Superviser et autonomiser les coopératives de crédit à travers le Cameroun depuis 1968.",
  footer_quick_links: "Liens Rapides",
  footer_resources: "Ressources",
  footer_contact: "Contactez-Nous",
  footer_copyright: "© 2026 CamCCUL. Tous droits réservés.",
  footer_privacy: "Politique de Confidentialité",
  footer_terms: "Conditions d'Utilisation",
  footer_security: "Sécurité",
  footer_link_home: "Accueil",
  footer_link_about: "À Propos de Nous",
  footer_link_services: "Services",
  footer_link_affiliates: "Affiliés",
  footer_link_resources: "Ressources",
  footer_link_news: "Actualités",
  footer_link_contact: "Contact",
  footer_resource_cobac: "Règlements COBAC",
  footer_resource_training: "Supports de Formation",
  footer_resource_faq: "FAQ",
  footer_follow_us: "Suivez-nous",

  // ─── Homepage ─────────────────────────────────────────────────────────
  home_hero_badge: "Réglementé par la COBAC",
  home_hero_title:
    "Superviser Plus de 220 Coopératives de Crédit à Travers le Cameroun",
  home_hero_subtitle:
    "Promouvoir l'inclusion financière par une réglementation transparente, la technologie moderne et le renforcement des capacités des coopératives de crédit depuis 1968.",
  home_hero_button: "Découvrir Nos Services",
  home_glance_title: "La Ligue en un Coup d'Œil",
  home_glance_affiliates_label: "Coopératives Affiliées",
  home_glance_affiliates_trend: "Décompte en direct de l'annuaire",
  home_glance_regions_label: "Régions Couvertes",
  home_glance_regions_trend: "Tout le Cameroun",
  home_glance_years_label: "Années de Service",
  home_glance_years_trend: "Depuis 1968",
  home_glance_members_label: "Membres Servis",
  home_glance_members_trend: "[Données en attente]",
  home_trust_title: "Reconnu et Réglementé Par",
  home_trust_mof: "Ministère des Finances",
  home_mission_title: "Notre Mission",
  home_mission_placeholder:
    "La déclaration de mission de CamCCUL apparaîtra ici. Ce texte provisoire illustre la mise en page et le format de la section mission. La déclaration de mission officielle sera fournie par le département de communication de la Ligue.",
  home_mission_card_financial_inclusion: "Inclusion Financière",
  home_mission_card_placeholder:
    "[Description du service à fournir par CamCCUL. Ce texte provisoire illustre la mise en page de la section services.]",
  home_services_title: "Ce Que Nous Faisons",
  home_service_regulatory_desc:
    "En tant qu'organe suprême de supervision des coopératives de crédit au Cameroun, CamCCUL veille à ce que chaque affilié opère en conformité avec la réglementation de la COBAC et les meilleures pratiques internationales. Notre cadre de supervision est conçu pour protéger les dépôts des membres, maintenir la stabilité financière et promouvoir la confiance dans le secteur financier coopératif.",
  home_service_auditing_desc:
    "L'audit financier est la pierre angulaire de la confiance au sein du mouvement des coopératives de crédit. Chez CamCCUL, notre équipe d'audit mène des examens approfondis et indépendants des états financiers, des contrôles internes et des procédures opérationnelles de chaque affilié. Nos audits garantissent aux membres, aux régulateurs et aux partenaires que les fonds des coopératives sont gérés de manière responsable et transparente.",
  home_service_capacity_desc:
    "CamCCUL propose des programmes solides de renforcement des capacités pour ses coopératives de crédit affiliées, dotant le personnel des compétences et connaissances essentielles pour gérer efficacement leurs institutions.",
  home_service_digitalization_desc:
    "Pilotage de la digitalisation de nos 220 coopératives de crédit affiliées, rationalisant les opérations et améliorant la prestation de services grâce à des technologies innovantes.",
  home_learn_more: "En savoir plus",
  home_affiliates_title: "Notre Présence à Travers le Cameroun",
  home_affiliates_subtitle:
    "Coopératives de crédit affiliées organisées dans les 10 régions du Cameroun.",
  home_stat_regions: "Régions",
  home_stat_unions: "Coopératives",
  home_stat_members: "Membres",
  home_stat_assets: "Actifs",
  home_find_cu_button: "Trouvez une Coopérative Près de Chez Vous",
  home_news_title: "Dernières Actualités",
  home_view_all: "Voir Tout",
  home_faq_title: "Des Questions ?",
  home_faq_subtitle:
    "Trouvez des réponses aux questions courantes sur CamCCUL, les coopératives de crédit et nos services.",
  home_faq_button: "Voir la FAQ",
  home_connect_title: "Restez Connectés",
  home_connect_subtitle:
    "Suivez CamCCUL sur Facebook pour les dernières actualités, photos d'événements et récits de la communauté.",
  home_connect_handle: "Suivez-nous @CamCCUL",
  home_connect_description:
    "Recevez des mises à jour en temps réel sur les activités de la Ligue, les sessions de formation, la couverture des AGO et les récits des coopératives de crédit à travers le Cameroun.",
  home_connect_button: "Suivre CamCCUL sur Facebook",
  home_connect_note: "S'ouvre dans un nouvel onglet",

  // ─── FAQ page ─────────────────────────────────────────────────────────
  faq_page_title: "Foire Aux Questions",

  // ─── About page ───────────────────────────────────────────────────────
  about_page_title: "À propos de CamCCUL",
  about_history_title: "Notre Histoire",
  about_history_subtitle:
    "Un héritage de service aux coopératives de crédit du Cameroun depuis 1968.",
  about_mission_vision_title: "Notre Mission et Vision",
  about_mission_vision_subtitle:
    "Les principes directeurs qui guident notre action dans les 10 régions du Cameroun.",
  about_mission_title: "Notre Mission",
  about_vision_title: "Notre Vision",
  about_leadership_title: "Conseil d'Administration",
  about_leadership_subtitle:
    "La direction dévouée qui guide l'orientation stratégique de CamCCUL.",
  about_presence_title: "Notre Présence à Travers le Cameroun",
  about_presence_subtitle:
    "Plus de 220 coopératives de crédit affiliées au service des membres dans chaque région du pays.",
  about_presence_paragraph:
    "CamCCUL agit comme organe faîtier des coopératives de crédit affiliées organisées dans les dix régions du Cameroun. Chaque affiliée opère de manière indépendante au sein de sa communauté tout en respectant les normes de réglementation, de reporting et de renforcement des capacités fixées par la Ligue, permettant aux membres à travers le pays d'accéder à des services financiers coopératifs cohérents, près de chez eux.",
  about_milestone_present: "Présent",

  // ─── Affiliates page ──────────────────────────────────────────────────
  affiliates_page_title: "Nos Coopératives de Crédit Affiliées",
  affiliates_page_subtitle: "Sélectionnez une région pour voir ses coopératives de crédit affiliées",
  affiliates_select_title: "Trouvez des Coopératives de Crédit dans Votre Région",
  affiliates_select_description:
    "Sélectionnez une région dans le menu déroulant ci-dessous pour voir toutes les coopératives de crédit affiliées de cette zone.",
  affiliates_select_placeholder: "— Sélectionnez une Région —",
  affiliates_region_label: "Région :",
  affiliates_total_label: "Total des Coopératives de Crédit :",
  affiliates_change_region: "Changer de Région",
  affiliates_empty_title: "Aucune coopérative de crédit trouvée dans cette région.",
  affiliates_empty_subtitle: "Veuillez sélectionner une autre région.",

  // ─── Contact page ─────────────────────────────────────────────────────
  contact_page_title: "Contactez-nous",
  contact_page_subtitle:
    "Nous serions ravis de vous entendre. Contactez le siège de la Ligue ou votre bureau régional.",
  contact_thank_you: "Merci !",
  contact_thank_you_message:
    "Votre message a été reçu. Nous vous répondrons sous 2 jours ouvrables.",
  contact_send_another: "Envoyer un Autre Message",
  contact_error_message: "Une erreur s'est produite. Veuillez réessayer.",
  contact_label_name: "Nom",
  contact_label_email: "Courriel",
  contact_label_subject: "Sujet",
  contact_label_message: "Message",
  contact_sending: "Envoi en cours...",
  contact_send_message: "Envoyer le Message",
  contact_info_title: "Coordonnées",
  contact_label_address: "Adresse",
  contact_label_phone: "Téléphone",
  contact_label_office_hours: "Heures d'Ouverture",
  contact_regional_offices_title: "Bureaux Régionaux",
  contact_regional_offices_text:
    "CamCCUL maintient des bureaux régionaux dans les 10 régions. Contactez le siège pour toute information sur les bureaux régionaux.",
  contact_follow_us_online: "Suivez-nous en Ligne",
  contact_facebook_link_text: "CamCCUL sur Facebook",
  contact_validation_name: "Le nom doit comporter au moins 2 caractères.",
  contact_validation_email: "Saisissez une adresse courriel valide.",
  contact_validation_subject: "Le sujet doit comporter au moins 5 caractères.",
  contact_validation_message: "Le message doit comporter au moins 10 caractères.",

  // ─── News page ────────────────────────────────────────────────────────
  news_page_title: "Actualités et Circulaires",
  news_page_subtitle: "Restez informé des dernières actualités de CamCCUL.",
  news_category_all: "Toutes",
  news_read_more: "Lire la Suite →",
  news_read_more_cta: "Lire la Suite",
  news_previous: "Précédent",
  news_next: "Suivant",
  news_page_label: "Page",
  news_of_label: "sur",
  news_empty_title: "Aucun article dans cette catégorie.",
  news_empty_subtitle: "Sélectionnez une autre catégorie pour en voir plus.",

  // ─── Resources page ───────────────────────────────────────────────────
  resources_page_title: "Ressources et Téléchargements",
  resources_page_subtitle:
    "Accédez aux modèles COBAC, supports de formation et documents réglementaires.",
  resources_tab_templates: "Modèles de Rapports",
  resources_tab_cobac: "Règlements COBAC",
  resources_tab_training: "Supports de Formation",
  resources_tab_forms: "Formulaires",
  resources_download: "Télécharger",
  resources_empty_title: "Aucune ressource dans cette catégorie pour le moment.",
  resources_empty_subtitle: "Revenez bientôt pour de nouveaux téléchargements.",

  // ─── Services index page ──────────────────────────────────────────────
  services_page_title: "Nos Services",
  services_page_subtitle:
    "CamCCUL accompagne ses plus de 220 coopératives de crédit affiliées à travers quatre services essentiels : supervision réglementaire, audit financier, renforcement des capacités et digitalisation.",
  services_learn_more: "En savoir plus",

  // ─── Services detail pages (hero subtitles) ──────────────────────────
  service_regulatory_subtitle:
    "Garantir la conformité et la stabilité financière des 220 coopératives de crédit affiliées.",
  service_auditing_subtitle:
    "Des audits indépendants et rigoureux garantissant transparence et responsabilité dans toutes les coopératives de crédit affiliées.",
  service_capacity_subtitle:
    "Doter le personnel des coopératives de crédit des compétences, connaissances et outils essentiels à l'excellence opérationnelle.",
  service_digitalization_subtitle:
    "Transformer les opérations et la prestation de services grâce à des technologies innovantes dans les 220 coopératives de crédit affiliées.",

  // ─── Not found / loading ──────────────────────────────────────────────
  notfound_title: "Page Introuvable",
  notfound_message:
    "La page que vous recherchez n'existe pas ou a peut-être été déplacée. Veuillez vérifier l'URL ou retourner à la page d'accueil.",
  notfound_back_home: "Retour à l'Accueil",
  loading_text: "Chargement...",

  // ─── Chatbot ──────────────────────────────────────────────────────────
  chatbot_assistant_name: "Assistant CamCCUL",
  chatbot_placeholder: "Tapez votre question...",
  chatbot_welcome:
    "Bonjour ! 👋 Je suis l'assistant virtuel de CamCCUL. Je peux vous aider avec des questions sur la Ligue, trouver une coopérative de crédit près de chez vous, nos services, ou comment nous contacter. Que souhaitez-vous savoir ?",
  chatbot_typing: "En train d'écrire...",
  chatbot_open_aria: "Ouvrir l'assistant de discussion",
  chatbot_close_aria: "Fermer l'assistant de discussion",
  chatbot_input_aria: "Tapez votre message",
  chatbot_send_aria: "Envoyer le message",
  chatbot_error:
    "Désolé, j'ai des difficultés à me connecter en ce moment. Veuillez réessayer dans un instant, ou contactez directement CamCCUL au +237 233 36 11 82 ou à info@camccul.cm.",
};

export const translations = { en, fr };

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;

// For content that lives in mock-data.ts (or a page's own local data) rather
// than this dictionary — e.g. milestones, leadership bios, news articles —
// translatable fields hold both languages directly instead of a lookup key.
export interface LocalizedText {
  en: string;
  fr: string;
}

export function localize(field: LocalizedText, language: Language): string {
  return field[language];
}
