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
  nav_language_aria: "Change language",
  nav_menu_open_aria: "Toggle menu",
  nav_menu_close_aria: "Close menu",
  nav_services_toggle_aria: "Toggle services",
  nav_about_toggle_aria: "Toggle about",
  nav_find_credit_union: "Find a Credit Union",

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
  home_hero_title_prefix: "Supervising",
  home_hero_title_suffix: "Credit Unions Across Cameroon",
  home_hero_subtitle:
    "Empowering financial inclusion through transparent regulation, modern technology, and capacity building for cooperative credit unions since 1968.",
  home_hero_button: "Explore Our Services",
  home_glance_title: "League at a Glance",
  home_glance_affiliates_label: "Affiliated Credit Unions",
  home_glance_regions_label: "Regions Covered",
  home_glance_years_label: "Years of Service",
  home_trust_title: "Recognized & Regulated By",
  home_trust_mof: "Ministry of Finance",
  home_about_title: "About CamCCUL",
  home_services_title: "What We Do",
  home_what_we_do_subtitle:
    "Comprehensive support for credit unions across all 10 regions of Cameroon.",
  home_service_regulatory_desc:
    "As the apex supervisory body for cooperative credit unions in Cameroon, CamCCUL is responsible for ensuring that every affiliate operates in compliance with COBAC regulations and international best practices. Our supervision framework is designed to protect member deposits, maintain financial stability, and promote confidence in the cooperative financial sector.",
  home_service_auditing_desc:
    "Financial auditing is the cornerstone of trust in the cooperative credit union movement. At CamCCUL, our audit team conducts thorough, independent examinations of every affiliate's financial statements, internal controls, and operational procedures. Our audits provide assurance to members, regulators, and partners that credit union funds are managed responsibly and transparently.",
  home_service_capacity_desc:
    "CamCCUL offers robust capacity building training for its affiliate credit unions, equipping staff with essential skills and knowledge to manage their institutions effectively.",
  home_service_digitalization_desc:
    "Spearheading the digitalization of our {count} affiliate credit unions, streamlining operations and enhancing service delivery through innovative technology.",
  home_service_regulatory_short:
    "Ensuring every affiliate credit union complies with COBAC regulations to protect member deposits and maintain financial stability.",
  home_service_auditing_short:
    "Independent, thorough audits of every affiliate's finances and controls — protecting member savings through transparent oversight.",
  home_service_capacity_short:
    "Training programs equipping credit union staff and boards with the skills to manage their institutions effectively.",
  home_service_digitalization_short:
    "Modernizing credit union operations with digital tools for faster reporting, better oversight, and improved member service.",
  home_learn_more: "Learn more →",
  home_affiliates_title: "Our Reach Across Cameroon",
  home_reach_subtitle_suffix:
    "affiliate credit unions serving members in every region of the country.",
  home_news_title: "Latest News & Circulars",
  home_view_all: "View all →",
  home_faq_subtitle:
    "Find answers to common questions about CamCCUL, credit unions, and our services.",
  newsletter_heading: "Stay Updated",
  newsletter_placeholder: "Your email address",
  newsletter_button: "Subscribe",

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
    "{count}+ affiliate credit unions serving members in every region of the country.",
  about_presence_paragraph:
    "CamCCUL operates as the umbrella body for affiliated credit unions organized across all ten regions of Cameroon. Each affiliate operates independently within its community while adhering to the regulatory, reporting, and capacity-building standards set by the League, allowing members nationwide to access consistent, cooperative financial services close to home.",
  about_milestone_present: "Present",
  about_read_more: "Read more",

  // ─── Affiliates page ──────────────────────────────────────────────────
  affiliates_page_title: "Our Affiliate Credit Unions",
  affiliates_page_subtitle: "Select a chapter to view its affiliated credit unions",
  affiliates_select_title: "Find Credit Unions in Your Chapter",
  affiliates_select_description:
    "Select a chapter from the dropdown below to view all affiliated credit unions in that chapter.",
  affiliates_select_placeholder: "— Select a Chapter —",
  affiliates_region_label: "Chapter:",
  affiliates_total_label: "Total Credit Unions:",
  affiliates_change_region: "Change Chapter",
  affiliates_empty_title: "No credit unions found in this chapter.",
  affiliates_empty_subtitle: "Please select a different chapter.",
  affiliates_profile_pending_message:
    "This credit union's full profile is being updated. Please check back soon or contact CamCCUL headquarters at +237 233 36 11 82.",
  affiliate_year_founded_label: "Year Founded",
  affiliate_leadership_heading: "Leadership",
  affiliate_board_chairperson_label: "Board Chairperson",
  affiliate_general_manager_label: "General Manager",
  affiliates_contact_hq_note: "Contact CamCCUL headquarters for details",
  affiliates_view_profile: "View Chapter Profile",
  affiliates_profile_available: "Profile Available",
  affiliates_profile_pending: "Profile Pending",

  // ─── Chapter Profile Page ───────────────────────────────────────────────
  chapter_not_found_title: "Chapter Not Found",
  chapter_not_found_message:
    "We couldn't find a chapter with this code. It may have been moved, or the code may be incorrect.",
  chapter_not_found_back: "Back to Affiliates Directory",
  chapter_about_prefix: "About",
  chapter_history_fallback:
    "History information coming soon. This chapter's full profile is being updated.",
  chapter_year_established_label: "Year Established",
  chapter_services_heading: "Services Offered",
  chapter_contact_heading: "Contact Information",
  chapter_generic_fallback:
    "This information is being updated. Please check back soon or contact CamCCUL headquarters.",
  chapter_under_review:
    "This chapter's full profile is under review and will be available soon.",
  chapter_members_label: "Total Members",
  chapter_branches_label: "Number of Branches",
  chapter_credit_union_count_label: "Member Credit Unions",
  chapter_leadership_heading: "Chapter Leadership",
  chapter_president_label: "Chapter President",
  chapter_supervisor_label: "Chapter Supervisor",
  chapter_board_size_label: "Board Members",
  chapter_staff_count_label: "Chapter Staff",
  chapter_credit_unions_heading: "Member Credit Unions",
  chapter_credit_unions_empty: "Member credit union information is being updated.",
  chapter_credit_union_code_prefix: "Code:",
  chapter_visit_heading: "Visit the Chapter",
  chapter_map_placeholder: "Map coming soon",
  chapter_contact_cta: "Contact CamCCUL Headquarters",
  chapter_visit_note:
    "For security, individual contact details are not published online. Please contact the chapter directly using the details above.",

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
  contact_label_phone_number: "Phone Number (optional)",
  contact_label_subject: "Subject",
  contact_label_message: "Message",
  contact_sending: "Sending...",
  contact_send_message: "Send Message",
  contact_info_title: "Contact Information",
  contact_label_address: "Address",
  contact_label_office_hours: "Office Hours",
  contact_immediate_assistance_note:
    "For immediate assistance, please use the contact form or visit our office during business hours.",
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

  // ─── Credit Union Profile Form (printable) ─────────────────────────────
  cu_form_back_to_resources: "Back to Resources",
  cu_form_download_pdf: "Download as PDF",
  cu_form_title: "Credit Union Profile Form",
  cu_form_description:
    "Please complete all fields for your credit union. This information will appear on the CamCCUL website when visitors click on your credit union in the Affiliates directory.",
  cu_form_version_label: "Form Version:",
  cu_form_version_value: "August 2026",
  cu_form_section1_title: "Section 1: Credit Union Information",
  cu_form_full_name: "Credit Union Full Name",
  cu_form_chapter_field: "Chapter (e.g., Northwest Chapter, Southwest Chapter)",
  cu_form_affiliation_code: "CamCCUL Affiliation Code",
  cu_form_year_founded: "Year Founded",
  cu_form_physical_address: "Physical Address",
  cu_form_city_town: "City/Town",
  cu_form_section2_title: "Section 2: Contact Information",
  cu_form_primary_phone: "Primary Phone Number",
  cu_form_secondary_phone: "Secondary Phone Number",
  cu_form_email_address: "Email Address",
  cu_form_website: "Website",
  cu_form_optional_suffix: "(optional)",
  cu_form_section3_title: "Section 3: Credit Union Profile",
  cu_form_brief_history: "Brief History of the Credit Union (500 words max)",
  cu_form_current_members: "Current Number of Members",
  cu_form_services_offered: "Services Offered (tick all that apply):",
  cu_form_service_savings: "Savings Accounts",
  cu_form_service_loans_personal: "Loans (Personal)",
  cu_form_service_loans_business: "Loans (Business)",
  cu_form_service_loans_agricultural: "Loans (Agricultural)",
  cu_form_service_money_transfers: "Money Transfers",
  cu_form_service_mobile_banking: "Mobile Banking",
  cu_form_service_financial_education: "Financial Education",
  cu_form_other_label: "Other:",
  cu_form_section4_title: "Section 4: Leadership",
  cu_form_board_chairperson: "Board Chairperson Name",
  cu_form_general_manager: "General Manager Name",
  cu_form_board_members_count: "Number of Board Members",
  cu_form_staff_count: "Number of Staff",
  cu_form_section5_title: "Section 5: Declaration",
  cu_form_certify:
    "I certify that the information provided above is accurate and complete.",
  cu_form_completed_by: "Name of Person Completing Form",
  cu_form_position: "Position",
  cu_form_date: "Date",
  cu_form_signature: "Signature",
  cu_form_footer_upload:
    "Completed forms should be uploaded via the CamCCUL website or emailed to info@camccul.cm",
  cu_form_footer_assistance: "For assistance, call +237 233 36 11 82",

  // ─── Services index page ──────────────────────────────────────────────
  services_page_title: "Our Services",
  services_page_subtitle:
    "CamCCUL supports its {count}+ affiliate credit unions through four core services: regulatory supervision, financial auditing, capacity building, and digitalization.",
  services_learn_more: "Learn more",

  // ─── Services detail pages (hero subtitles) ──────────────────────────
  service_regulatory_subtitle:
    "Ensuring compliance and financial stability across all {count} affiliate credit unions.",
  service_auditing_subtitle:
    "Independent, rigorous audits ensuring transparency and accountability across all affiliate credit unions.",
  service_capacity_subtitle:
    "Equipping credit union staff with essential skills, knowledge, and tools for operational excellence.",
  service_digitalization_subtitle:
    "Transforming operations and service delivery through innovative technology across all {count} affiliate credit unions.",

  // ─── Not found / loading ──────────────────────────────────────────────
  notfound_title: "Page Not Found",
  notfound_message:
    "The page you're looking for doesn't exist or may have been moved. Please check the URL or return to the homepage.",
  notfound_back_home: "Back to Home",
  loading_text: "Loading...",

  // ─── Chatbot ──────────────────────────────────────────────────────────
  chatbot_assistant_name: "Cami — CamCCUL Assistant",
  chatbot_trigger_label: "Chat with Cami",
  chatbot_placeholder: "Type your question...",
  chatbot_typing: "Typing...",
  chatbot_open_aria: "Open chat assistant",
  chatbot_close_aria: "Close chat assistant",
  chatbot_input_aria: "Type your message",
  chatbot_send_aria: "Send message",
  chatbot_disclaimer: "Automated assistant · Not financial advice",
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
  nav_language_aria: "Changer de langue",
  nav_menu_open_aria: "Basculer le menu",
  nav_menu_close_aria: "Fermer le menu",
  nav_services_toggle_aria: "Basculer les services",
  nav_about_toggle_aria: "Basculer à propos",
  nav_find_credit_union: "Trouver une Coopérative",

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
  home_hero_title_prefix: "Superviser",
  home_hero_title_suffix: "Coopératives de Crédit à Travers le Cameroun",
  home_hero_subtitle:
    "Promouvoir l'inclusion financière par une réglementation transparente, la technologie moderne et le renforcement des capacités des coopératives de crédit depuis 1968.",
  home_hero_button: "Découvrir Nos Services",
  home_glance_title: "La Ligue en un Coup d'Œil",
  home_glance_affiliates_label: "Coopératives Affiliées",
  home_glance_regions_label: "Régions Couvertes",
  home_glance_years_label: "Années de Service",
  home_trust_title: "Reconnu et Réglementé Par",
  home_trust_mof: "Ministère des Finances",
  home_about_title: "À Propos de CamCCUL",
  home_services_title: "Ce Que Nous Faisons",
  home_what_we_do_subtitle:
    "Un accompagnement complet pour les coopératives de crédit dans les 10 régions du Cameroun.",
  home_service_regulatory_desc:
    "En tant qu'organe suprême de supervision des coopératives de crédit au Cameroun, CamCCUL veille à ce que chaque affilié opère en conformité avec la réglementation de la COBAC et les meilleures pratiques internationales. Notre cadre de supervision est conçu pour protéger les dépôts des membres, maintenir la stabilité financière et promouvoir la confiance dans le secteur financier coopératif.",
  home_service_auditing_desc:
    "L'audit financier est la pierre angulaire de la confiance au sein du mouvement des coopératives de crédit. Chez CamCCUL, notre équipe d'audit mène des examens approfondis et indépendants des états financiers, des contrôles internes et des procédures opérationnelles de chaque affilié. Nos audits garantissent aux membres, aux régulateurs et aux partenaires que les fonds des coopératives sont gérés de manière responsable et transparente.",
  home_service_capacity_desc:
    "CamCCUL propose des programmes solides de renforcement des capacités pour ses coopératives de crédit affiliées, dotant le personnel des compétences et connaissances essentielles pour gérer efficacement leurs institutions.",
  home_service_digitalization_desc:
    "Pilotage de la digitalisation de nos {count} coopératives de crédit affiliées, rationalisant les opérations et améliorant la prestation de services grâce à des technologies innovantes.",
  home_service_regulatory_short:
    "Nous veillons à ce que chaque coopérative affiliée respecte la réglementation de la COBAC pour protéger l'épargne des membres.",
  home_service_auditing_short:
    "Des audits indépendants et rigoureux des finances de chaque affiliée, pour protéger l'épargne des membres en toute transparence.",
  home_service_capacity_short:
    "Des formations qui dotent le personnel et les conseils des coopératives des compétences nécessaires pour bien gérer leurs institutions.",
  home_service_digitalization_short:
    "Nous modernisons les opérations des coopératives grâce au numérique : rapports plus rapides, meilleure supervision, meilleur service.",
  home_learn_more: "En savoir plus →",
  home_affiliates_title: "Notre Présence à Travers le Cameroun",
  home_reach_subtitle_suffix:
    "coopératives de crédit affiliées au service de membres dans chaque région du pays.",
  home_news_title: "Dernières Actualités et Circulaires",
  home_view_all: "Voir tout →",
  home_faq_subtitle:
    "Trouvez des réponses aux questions courantes sur CamCCUL, les coopératives de crédit et nos services.",
  newsletter_heading: "Restez Informé",
  newsletter_placeholder: "Votre adresse courriel",
  newsletter_button: "S'abonner",

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
    "Plus de {count} coopératives de crédit affiliées au service des membres dans chaque région du pays.",
  about_presence_paragraph:
    "CamCCUL agit comme organe faîtier des coopératives de crédit affiliées organisées dans les dix régions du Cameroun. Chaque affiliée opère de manière indépendante au sein de sa communauté tout en respectant les normes de réglementation, de reporting et de renforcement des capacités fixées par la Ligue, permettant aux membres à travers le pays d'accéder à des services financiers coopératifs cohérents, près de chez eux.",
  about_milestone_present: "Présent",
  about_read_more: "En savoir plus",

  // ─── Affiliates page ──────────────────────────────────────────────────
  affiliates_page_title: "Nos Coopératives de Crédit Affiliées",
  affiliates_page_subtitle: "Sélectionnez un chapitre pour voir ses coopératives de crédit affiliées",
  affiliates_select_title: "Trouvez des Coopératives de Crédit dans Votre Chapitre",
  affiliates_select_description:
    "Sélectionnez un chapitre dans le menu déroulant ci-dessous pour voir toutes les coopératives de crédit affiliées de ce chapitre.",
  affiliates_select_placeholder: "— Sélectionnez un Chapitre —",
  affiliates_region_label: "Chapitre :",
  affiliates_total_label: "Total des Coopératives de Crédit :",
  affiliates_change_region: "Changer de Chapitre",
  affiliates_empty_title: "Aucune coopérative de crédit trouvée dans ce chapitre.",
  affiliates_empty_subtitle: "Veuillez sélectionner un autre chapitre.",
  affiliates_profile_pending_message:
    "Le profil complet de cette coopérative de crédit est en cours de mise à jour. Veuillez revenir bientôt ou contacter le siège de CamCCUL au +237 233 36 11 82.",
  affiliate_year_founded_label: "Année de Fondation",
  affiliate_leadership_heading: "Direction",
  affiliate_board_chairperson_label: "Président du Conseil d'Administration",
  affiliate_general_manager_label: "Directeur Général",
  affiliates_contact_hq_note: "Contactez le siège de CamCCUL pour plus de détails",
  affiliates_profile_available: "Profil Disponible",
  affiliates_profile_pending: "Profil en Attente",
  affiliates_view_profile: "Voir le Profil du Chapitre",

  // ─── Chapter Profile Page ───────────────────────────────────────────────
  chapter_not_found_title: "Chapitre Introuvable",
  chapter_not_found_message:
    "Nous n'avons pas trouvé de chapitre avec ce code. Il a peut-être été déplacé, ou le code est peut-être incorrect.",
  chapter_not_found_back: "Retour à l'Annuaire des Affiliés",
  chapter_about_prefix: "À propos de",
  chapter_history_fallback:
    "Les informations historiques seront bientôt disponibles. Le profil complet de ce chapitre est en cours de mise à jour.",
  chapter_year_established_label: "Année de Création",
  chapter_services_heading: "Services Offerts",
  chapter_contact_heading: "Coordonnées",
  chapter_generic_fallback:
    "Ces informations sont en cours de mise à jour. Veuillez revenir bientôt ou contacter le siège de CamCCUL.",
  chapter_under_review:
    "Le profil complet de ce chapitre est en cours d'examen et sera bientôt disponible.",
  chapter_members_label: "Total des Membres",
  chapter_branches_label: "Nombre de Succursales",
  chapter_credit_union_count_label: "Coopératives de Crédit Membres",
  chapter_leadership_heading: "Direction du Chapitre",
  chapter_president_label: "Président du Chapitre",
  chapter_supervisor_label: "Superviseur du Chapitre",
  chapter_board_size_label: "Membres du Conseil",
  chapter_staff_count_label: "Personnel du Chapitre",
  chapter_credit_unions_heading: "Coopératives de Crédit Membres",
  chapter_credit_unions_empty:
    "Les informations sur les coopératives de crédit membres sont en cours de mise à jour.",
  chapter_credit_union_code_prefix: "Code :",
  chapter_visit_heading: "Visiter le Chapitre",
  chapter_map_placeholder: "Carte bientôt disponible",
  chapter_contact_cta: "Contacter le Siège de CamCCUL",
  chapter_visit_note:
    "Pour des raisons de sécurité, les coordonnées individuelles ne sont pas publiées en ligne. Veuillez contacter le chapitre directement en utilisant les coordonnées ci-dessus.",

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
  contact_label_phone_number: "Numéro de téléphone (facultatif)",
  contact_label_subject: "Sujet",
  contact_label_message: "Message",
  contact_sending: "Envoi en cours...",
  contact_send_message: "Envoyer le Message",
  contact_info_title: "Coordonnées",
  contact_label_address: "Adresse",
  contact_label_office_hours: "Heures d'Ouverture",
  contact_immediate_assistance_note:
    "Pour une assistance immédiate, veuillez utiliser le formulaire de contact ou visiter notre bureau pendant les heures ouvrables.",
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

  // ─── Credit Union Profile Form (printable) ─────────────────────────────
  cu_form_back_to_resources: "Retour aux Ressources",
  cu_form_download_pdf: "Télécharger en PDF",
  cu_form_title: "Formulaire de Profil de Coopérative de Crédit",
  cu_form_description:
    "Veuillez remplir tous les champs pour votre coopérative de crédit. Ces informations apparaîtront sur le site web de CamCCUL lorsque les visiteurs cliqueront sur votre coopérative de crédit dans l'annuaire des Affiliés.",
  cu_form_version_label: "Version du formulaire :",
  cu_form_version_value: "Août 2026",
  cu_form_section1_title: "Section 1 : Informations sur la Coopérative de Crédit",
  cu_form_full_name: "Nom Complet de la Coopérative de Crédit",
  cu_form_chapter_field: "Chapitre (p. ex., Chapitre du Nord-Ouest, Chapitre du Sud-Ouest)",
  cu_form_affiliation_code: "Code d'Affiliation CamCCUL",
  cu_form_year_founded: "Année de Fondation",
  cu_form_physical_address: "Adresse Physique",
  cu_form_city_town: "Ville/Localité",
  cu_form_section2_title: "Section 2 : Coordonnées",
  cu_form_primary_phone: "Numéro de Téléphone Principal",
  cu_form_secondary_phone: "Numéro de Téléphone Secondaire",
  cu_form_email_address: "Adresse E-mail",
  cu_form_website: "Site Web",
  cu_form_optional_suffix: "(facultatif)",
  cu_form_section3_title: "Section 3 : Profil de la Coopérative de Crédit",
  cu_form_brief_history: "Bref Historique de la Coopérative de Crédit (500 mots max)",
  cu_form_current_members: "Nombre Actuel de Membres",
  cu_form_services_offered: "Services Offerts (cochez tout ce qui s'applique) :",
  cu_form_service_savings: "Comptes d'Épargne",
  cu_form_service_loans_personal: "Prêts (Personnels)",
  cu_form_service_loans_business: "Prêts (Entreprises)",
  cu_form_service_loans_agricultural: "Prêts (Agricoles)",
  cu_form_service_money_transfers: "Transferts d'Argent",
  cu_form_service_mobile_banking: "Services Bancaires Mobiles",
  cu_form_service_financial_education: "Éducation Financière",
  cu_form_other_label: "Autre :",
  cu_form_section4_title: "Section 4 : Direction",
  cu_form_board_chairperson: "Nom du Président du Conseil d'Administration",
  cu_form_general_manager: "Nom du Directeur Général",
  cu_form_board_members_count: "Nombre de Membres du Conseil d'Administration",
  cu_form_staff_count: "Nombre d'Employés",
  cu_form_section5_title: "Section 5 : Déclaration",
  cu_form_certify:
    "Je certifie que les informations fournies ci-dessus sont exactes et complètes.",
  cu_form_completed_by: "Nom de la Personne Remplissant le Formulaire",
  cu_form_position: "Poste",
  cu_form_date: "Date",
  cu_form_signature: "Signature",
  cu_form_footer_upload:
    "Les formulaires complétés doivent être téléversés via le site web de CamCCUL ou envoyés par e-mail à info@camccul.cm",
  cu_form_footer_assistance: "Pour toute assistance, appelez le +237 233 36 11 82",

  // ─── Services index page ──────────────────────────────────────────────
  services_page_title: "Nos Services",
  services_page_subtitle:
    "CamCCUL accompagne ses plus de {count} coopératives de crédit affiliées à travers quatre services essentiels : supervision réglementaire, audit financier, renforcement des capacités et digitalisation.",
  services_learn_more: "En savoir plus",

  // ─── Services detail pages (hero subtitles) ──────────────────────────
  service_regulatory_subtitle:
    "Garantir la conformité et la stabilité financière des {count} coopératives de crédit affiliées.",
  service_auditing_subtitle:
    "Des audits indépendants et rigoureux garantissant transparence et responsabilité dans toutes les coopératives de crédit affiliées.",
  service_capacity_subtitle:
    "Doter le personnel des coopératives de crédit des compétences, connaissances et outils essentiels à l'excellence opérationnelle.",
  service_digitalization_subtitle:
    "Transformer les opérations et la prestation de services grâce à des technologies innovantes dans les {count} coopératives de crédit affiliées.",

  // ─── Not found / loading ──────────────────────────────────────────────
  notfound_title: "Page Introuvable",
  notfound_message:
    "La page que vous recherchez n'existe pas ou a peut-être été déplacée. Veuillez vérifier l'URL ou retourner à la page d'accueil.",
  notfound_back_home: "Retour à l'Accueil",
  loading_text: "Chargement...",

  // ─── Chatbot ──────────────────────────────────────────────────────────
  chatbot_assistant_name: "Cami — Assistante CamCCUL",
  chatbot_trigger_label: "Discuter avec Cami",
  chatbot_placeholder: "Tapez votre question...",
  chatbot_typing: "En train d'écrire...",
  chatbot_open_aria: "Ouvrir l'assistant de discussion",
  chatbot_close_aria: "Fermer l'assistant de discussion",
  chatbot_input_aria: "Tapez votre message",
  chatbot_send_aria: "Envoyer le message",
  chatbot_disclaimer: "Assistant automatisé · Pas un conseil financier",
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
