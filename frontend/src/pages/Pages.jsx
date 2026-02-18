import React from 'react';
import { MENU_ITEMS } from "../components/Navbar/MenuItem";
import SidebarLayout from "../components/Layout/SidebarLayout";

// Generic Page Component
export const Page = ({ title }) => (
    <div className="py-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <div className="prose max-w-none text-gray-600">
            <p className="text-lg">This is the {title} page content.</p>
            <p className="mt-4">
                Content will be populated here. The layout on the left shows the navigation structure for this section.
            </p>
        </div>
    </div>
);

// Layout Wrapper
const SectionLayout = ({ sectionLabel, title }) => {
    const section = MENU_ITEMS.find(item => item.label === sectionLabel);
    const menuItems = section?.children || [];

    if (!section || menuItems.length === 0) {
        return (
            <div className="container mx-auto py-10 px-8 min-h-[60vh]">
                <Page title={title} />
            </div>
        );
    }

    return (
        <SidebarLayout title={sectionLabel} menuItems={menuItems}>
            <Page title={title} />
        </SidebarLayout>
    );
};

// --- About Section ---
const ABOUT = "About";
export const About = () => <SectionLayout sectionLabel={ABOUT} title="About JNTUK" />;
export const Governance = () => <SectionLayout sectionLabel={ABOUT} title="Governance, Leadership and Management" />;
export const InstitutionalVision = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Vision and Leadership" />;
export const CoreValues = () => <SectionLayout sectionLabel={ABOUT} title="Core Values" />;
export const InstitutionalValues = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Values and Best Practices" />;

export const SWOC = () => <SectionLayout sectionLabel={ABOUT} title="SWOC" />;
export const InstitutionalStrength = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Strength" />;
export const InstitutionalWeakness = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Weakness" />;
export const InstitutionalOpportunity = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Opportunity" />;
export const InstitutionalChallenge = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Challenge" />;

export const Strategy = () => <SectionLayout sectionLabel={ABOUT} title="Strategy Development and Deployment" />;
export const InstitutionalBodies = () => <SectionLayout sectionLabel={ABOUT} title="Institutional Bodies" />;
export const Happenings = () => <SectionLayout sectionLabel={ABOUT} title="JNTUK Happenings" />;
export const Notifications = () => <SectionLayout sectionLabel={ABOUT} title="Notifications" />;
export const GoverningHierarchy = () => <SectionLayout sectionLabel={ABOUT} title="Governing Hierarchy" />;
export const UniversitySong = () => <SectionLayout sectionLabel={ABOUT} title="University Song" />;
export const MoUs = () => <SectionLayout sectionLabel={ABOUT} title="MoU's and Tie ups" />;
export const APCS = () => <SectionLayout sectionLabel={ABOUT} title="APCS Rules & Code of Conduct" />;
export const ActStatutes = () => <SectionLayout sectionLabel={ABOUT} title="JNTUK Act & Statutes" />;
export const RTI = () => <SectionLayout sectionLabel={ABOUT} title="RTI Act" />;
export const AntiRagging = () => <SectionLayout sectionLabel={ABOUT} title="Anti Ragging" />;
// Using Contact page from specialized component usually, but here for sidebar consistency if needed:
export const ContactSidebar = () => <SectionLayout sectionLabel={ABOUT} title="Contacts" />;


// --- Administration Section ---
// --- Administration Section ---
// --- Administration Section ---
const ADMINISTRATION = "Administration";
export const Administration = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Administration" />;

// Officials
export const Chancellor = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Chancellor" />;
export const ViceChancellor = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Vice Chancellor" />;
export const Rector = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Rector" />;
export const Registrar = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Registrar" />;
export const OSD = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Officer on Special Duty" />;

// Councils & Committees
export const ExecutiveCouncil = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Executive Council" />;
export const FinanceCommittee = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Finance Committee Members" />;
export const BoardOfStudies = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Board of Studies" />;
export const JNTUKVCs = () => <SectionLayout sectionLabel={ADMINISTRATION} title="JNTUK Vice Chancellors" />;

// Directorates
export const Directorates = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Directorates" />; // Parent page
export const DirectorAcademics = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Academics" />;
export const DirectorAffiliations = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Affiliations & Legal Matters" />;
export const DirectorEvaluations = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Evaluations" />;
export const DirectorStudentAffairs = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Student Affairs" />;
export const DirectorIQAC = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - IQAC & Capacity Building" />;
export const DirectorResearch = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Sponsored Research & IIIC" />;
export const DirectorIT = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - IT, OL & ODL" />;
export const DirectorRelations = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Corporate, Alumni & International Relations" />;
export const DirectorAdmissions = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Admissions" />;
export const DirectorIST = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Director - Institute of Science & Technology" />;
export const EstateOfficer = () => <SectionLayout sectionLabel={ADMINISTRATION} title="University Engineer-cum-Estate Officer" />;

// Principals
export const Principals = () => <SectionLayout sectionLabel={ADMINISTRATION} title="Principals" />; // Parent page
export const UCEK = () => <SectionLayout sectionLabel={ADMINISTRATION} title="JNTUK UCEK" />;
export const UCEN = () => <SectionLayout sectionLabel={ADMINISTRATION} title="JNTUK UCEN" />;


// --- Academics Section ---
const ACADEMICS = "Academics";
export const Academics = () => <SectionLayout sectionLabel={ACADEMICS} title="Academics" />;
export const Methodology = () => <SectionLayout sectionLabel={ACADEMICS} title="Methodology" />;
export const AcademicAdmission = () => <SectionLayout sectionLabel={ACADEMICS} title="Admission" />;
export const Undergraduate = () => <SectionLayout sectionLabel={ACADEMICS} title="Under Graduate" />;
export const Postgraduate = () => <SectionLayout sectionLabel={ACADEMICS} title="Post Graduate" />;
export const Research = () => <SectionLayout sectionLabel={ACADEMICS} title="Research" />;
export const Programmes = () => <SectionLayout sectionLabel={ACADEMICS} title="Programmes offered" />;
export const CircularAspects = () => <SectionLayout sectionLabel={ACADEMICS} title="Circular Aspects" />;
export const TeachingLearning = () => <SectionLayout sectionLabel={ACADEMICS} title="Teaching-Learning Process" />;
export const StudentSupport = () => <SectionLayout sectionLabel={ACADEMICS} title="Student Support and Progression" />;
export const Infrastructure = () => <SectionLayout sectionLabel={ACADEMICS} title="Infrastructure and Learning Resources" />;
export const ConstituentColleges = () => <SectionLayout sectionLabel={ACADEMICS} title="Constituent Colleges/Units" />;


// --- Campus Schools Section ---
const SCHOOLS = "Campus School's";
export const CampusSchools = () => <SectionLayout sectionLabel={SCHOOLS} title="Campus Schools" />;
export const SchoolHealth = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Health Sciences & Research" />;
export const SchoolRenewable = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Renewable Energy" />;
export const SchoolBiotech = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Biotechnology" />;
export const SchoolSpatial = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Spatial Information Technology" />;
export const SchoolPharmacy = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Pharmaceutical Sciences" />;
export const SchoolNano = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Nano Technology" />;
export const SchoolAvionics = () => <SectionLayout sectionLabel={SCHOOLS} title="School of Avionics" />;


// --- Examinations Section ---
const EXAMS = "Examinations";
export const Examinations = () => <SectionLayout sectionLabel={EXAMS} title="Examinations" />;
export const Results = () => <SectionLayout sectionLabel={EXAMS} title="RESULTS PORTAL" />;
export const DirectorEvaluation = () => <SectionLayout sectionLabel={EXAMS} title="Director - Evaluations" />;
export const AddlController = () => <SectionLayout sectionLabel={EXAMS} title="Addl Controller of Examinations" />;
export const ControllerUGPG = () => <SectionLayout sectionLabel={EXAMS} title="Controller of Examination (UG & PG)" />;
export const OnlineServices = () => <SectionLayout sectionLabel={EXAMS} title="Exam Section Online Services" />;
export const AffiliatedColleges = () => <SectionLayout sectionLabel={EXAMS} title="Affiliated Colleges" />;
export const AutonomousColleges = () => <SectionLayout sectionLabel={EXAMS} title="List of Autonomous Colleges" />;


// --- Accreditations Section ---
const ACCREDITATIONS = "Accreditations";
export const Accreditations = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="Accreditations" />;
export const NSSReport2025 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="JNTUK NSS Cell Report on Swarna Andhra-Swacch Andhra 19-04-2025" />;
export const NIRFEng2025 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="NIRF ENGINEERING Report -2025" />;
export const NIRFOverall2025 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="NIRF Overall Report -2025" />;
export const UGC12B = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="University Grants Commission 12(B)" />;
export const NIRF2020 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="National Institutional Rankings Framework (NIRF) – 2020" />;
export const StudentSatisfaction = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="Analysis Report and Questionnaire of Student Satisfaction Survey" />;
export const AQAR = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="Annual Quality Assurance Reports(AQAR)" />;
export const NAACSSR2017 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="NAAC Self Study Report (SSR) - Feb 2017" />;
export const NIRF2022 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="NIRF Overall Report -2022" />;
export const AQAR2017 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="JNTUK AQAR 2017-18" />;
export const NIRF2023 = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="NIRF Overall Report -2023" />;
export const NAACReports = () => <SectionLayout sectionLabel={ACCREDITATIONS} title="NAAC Reports" />;
