export const MENU_ITEMS = [
    {
        label: "About",
        path: "",
        children: [
            { label: "About JNTUK", path: "/about" },
            { label: "Governance, Leadership and Management",
              path: "/",
              children: [
                { label: "Institutional Vision and Leadership", path: "/institutional-vision-and-leadership" },
                { label: "Core Values", path: "/core-values" },
                { label: "Institutional Values and Best Practices", path: "/institutional-values-and-best-practices" },
              ]
            },
            {
                label: "SWOC",
                path: "/swoc",
                children: [
                    { label: "Institutional Strength", path: "/swoc/strength" },
                    { label: "Institutional Weakness", path: "/swoc/weakness" },
                    { label: "Institutional Opportunity", path: "/swoc/opportunity" },
                    { label: "Institutional Challenge", path: "/swoc/challenge" },
                ]
            },
            { label: "Strategy Development and Deployment", path: "/strategy" },
            { label: "Institutional Bodies", path: "/institutional-bodies" },
            { label: "JNTUK Happenings", path: "/happenings" },
            { label: "Notifications", path: "/notifications" },
            { label: "Governing Hierarchy", path: "/governing-hierarchy" },
            { label: "University Song", path: "/university-song" },
            { label: "MoU's and Tie ups", path: "/mous" },
            { label: "APCS Rules & Code of Conduct", path: "/conduct-rules" },
            { label: "JNTUK Act & Statutes", path: "/act-statutes" },
            { label: "RTI Act", path: "/rti-act" },
            { label: "Anti Ragging", path: "/anti-ragging" },
        
        ],
    },
    {
        label: "Administration",
        path: "/administration",
    },
    {
        label: "Academics",
        path: "/academics",
        children: [
            { label: "Methodology", path: "/academics/methodology" },
            { label: "Admission", path: "/academics/admission" },
            { label: "Under Graduate", path: "/academics/ug" },
            { label: "Post Graduate", path: "/academics/pg" },
            { label: "Research", path: "/academics/research" },
            { label: "Programmes offered", path: "/academics/programmes" },
            { label: "Circular Aspects", path: "/academics/circular-aspects" },
            { label: "Teaching-Learning Process", path: "/academics/teaching-learning" },
            { label: "Student Support and Progression", path: "/academics/student-support" },
            { label: "Infrastructure and Learning Resources", path: "/academics/infrastructure" },
            { label: "Constituent Colleges/Units", path: "/academics/constituent-colleges" },
        ],
    },
    {
        label: "Campus School's",
        path: "/campus-schools",
        children: [
            { label: "School of Health Sciences & Research", path: "/schools/health-sciences" },
            { label: "School of Renewable Energy and Environment", path: "/schools/renewable-energy" },
            { label: "School of Biotechnology", path: "/schools/biotech" },
            { label: "School of Spatial Information Technology", path: "/schools/sit" },
            { label: "School of Pharmaceutical Sciences & Technologies", path: "/schools/pharmacy" },
            { label: "School of Nano Technology", path: "/schools/nano-tech" },
            { label: "School of Avionics", path: "/schools/avionics" },
        ]
    },
    {
        label: "Examinations",
        path: "/examinations",
        children: [
            { label: "RESULTS PORTAL", path: "/examinations/results" },
            { label: "Director - Evaluations", path: "/examinations/director" },
            { label: "Addl Controller of Examinations", path: "/examinations/addl-controller" },
            { label: "Controller of Examination (UG & PG)", path: "/examinations/controller" },
            { label: "Exam Section Online Services", path: "/examinations/online-services" },
            { label: "Affiliated Colleges", path: "/examinations/affiliated-colleges" },
            { label: "List of Autonomous Colleges", path: "/examinations/autonomous-colleges" },
        ]
    },
    {
        label: "Accreditations",
        path: "/accreditations",
        children: [
            { label: "JNTUK NSS Cell Report on Swarna Andhra-Swacch Andhra 19-04-2025", path: "/accreditations/nss-report-2025" },
            { label: "NIRF ENGINEERING Report -2025", path: "/accreditations/nirf-engineering-2025" },
            { label: "NIRF Overall Report -2025", path: "/accreditations/nirf-overall-2025" },
            { label: "University Grants Commission 12(B)", path: "/accreditations/ugc-12b" },
            { label: "National Institutional Rankings Framework (NIRF) – 2020", path: "/accreditations/nirf-2020" },
            { label: "Analysis Report and Questionnaire of Student Satisfaction Survey", path: "/accreditations/student-satisfaction" },
            { label: "Annual Quality Assurance Reports(AQAR)", path: "/accreditations/aqar" },
            { label: "NAAC Self Study Report (SSR) - Feb 2017", path: "/accreditations/naac-ssr-2017" },
            { label: "NIRF Overall Report -2022", path: "/accreditations/nirf-2022" },
            { label: "JNTUK AQAR 2017-18", path: "/accreditations/aqar-2017-18" },
            { label: "NIRF Overall Report -2023", path: "/accreditations/nirf-2023" },
            { label: "NAAC Reports", path: "/accreditations/naac-reports" },
        ]
    }
];
