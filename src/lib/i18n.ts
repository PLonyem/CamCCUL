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
  nav_theme_aria: "Toggle dark mode",
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
  footer_resource_templates: "Reporting Templates",
  footer_resource_training: "Training Materials",
  footer_resource_faq: "FAQ",

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
  nav_theme_aria: "Basculer le mode sombre",
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
  footer_resource_templates: "Modèles de Rapports",
  footer_resource_training: "Supports de Formation",
  footer_resource_faq: "FAQ",

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
