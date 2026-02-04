import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home.jsx";
import {
  // About
  About, Governance, InstitutionalVision, CoreValues, InstitutionalValues,
  SWOC, InstitutionalStrength, InstitutionalWeakness, InstitutionalOpportunity, InstitutionalChallenge,
  Strategy, InstitutionalBodies, Happenings, Notifications, GoverningHierarchy,
  UniversitySong, MoUs, APCS, ActStatutes, RTI, AntiRagging, ContactSidebar,

  // Administration
  Administration,

  // Academics
  Academics, Methodology, AcademicAdmission, Undergraduate, Postgraduate, Research, Programmes,
  CircularAspects, TeachingLearning, StudentSupport, Infrastructure, ConstituentColleges,

  // Campus Schools
  CampusSchools, SchoolHealth, SchoolRenewable, SchoolBiotech, SchoolSpatial,
  SchoolPharmacy, SchoolNano, SchoolAvionics,

  // Examinations
  Examinations, Results, DirectorEvaluation, AddlController, ControllerUGPG,
  OnlineServices, AffiliatedColleges, AutonomousColleges,

  // Accreditations
  Accreditations, NSSReport2025, NIRFEng2025, NIRFOverall2025, UGC12B,
  NIRF2020, StudentSatisfaction, AQAR, NAACSSR2017, NIRF2022, AQAR2017,
  NIRF2023, NAACReports
} from "./pages/Pages.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/Footer/Footer.jsx";
import NotFound from "./pages/NotFound.jsx";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* --- About Routes --- */}
        <Route path="/about" element={<About />} />
        <Route path="/institutional-vision-and-leadership" element={<InstitutionalVision />} />
        <Route path="/core-values" element={<CoreValues />} />
        <Route path="/institutional-values-and-best-practices" element={<InstitutionalValues />} />

        <Route path="/swoc" element={<SWOC />} />
        <Route path="/swoc/strength" element={<InstitutionalStrength />} />
        <Route path="/swoc/weakness" element={<InstitutionalWeakness />} />
        <Route path="/swoc/opportunity" element={<InstitutionalOpportunity />} />
        <Route path="/swoc/challenge" element={<InstitutionalChallenge />} />

        <Route path="/strategy" element={<Strategy />} />
        <Route path="/institutional-bodies" element={<InstitutionalBodies />} />
        <Route path="/happenings" element={<Happenings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/governing-hierarchy" element={<GoverningHierarchy />} />
        <Route path="/university-song" element={<UniversitySong />} />
        <Route path="/mous" element={<MoUs />} />
        <Route path="/conduct-rules" element={<APCS />} />
        <Route path="/act-statutes" element={<ActStatutes />} />
        <Route path="/rti-act" element={<RTI />} />
        <Route path="/anti-ragging" element={<AntiRagging />} />
        {/* /contact is handled below as a main route, but included in sidebar logic via Navbar/Menu */}

        {/* --- Administration --- */}
        <Route path="/administration" element={<Administration />} />

        {/* --- Academics --- */}
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/methodology" element={<Methodology />} />
        <Route path="/academics/admission" element={<AcademicAdmission />} />
        <Route path="/academics/ug" element={<Undergraduate />} />
        <Route path="/academics/pg" element={<Postgraduate />} />
        <Route path="/academics/research" element={<Research />} />
        <Route path="/academics/programmes" element={<Programmes />} />
        <Route path="/academics/circular-aspects" element={<CircularAspects />} />
        <Route path="/academics/teaching-learning" element={<TeachingLearning />} />
        <Route path="/academics/student-support" element={<StudentSupport />} />
        <Route path="/academics/infrastructure" element={<Infrastructure />} />
        <Route path="/academics/constituent-colleges" element={<ConstituentColleges />} />

        {/* --- Campus Schools --- */}
        <Route path="/campus-schools" element={<CampusSchools />} />
        <Route path="/schools/health-sciences" element={<SchoolHealth />} />
        <Route path="/schools/renewable-energy" element={<SchoolRenewable />} />
        <Route path="/schools/biotech" element={<SchoolBiotech />} />
        <Route path="/schools/sit" element={<SchoolSpatial />} />
        <Route path="/schools/pharmacy" element={<SchoolPharmacy />} />
        <Route path="/schools/nano-tech" element={<SchoolNano />} />
        <Route path="/schools/avionics" element={<SchoolAvionics />} />

        {/* --- Examinations --- */}
        <Route path="/examinations" element={<Examinations />} />
        <Route path="/examinations/results" element={<Results />} />
        <Route path="/examinations/director" element={<DirectorEvaluation />} />
        <Route path="/examinations/addl-controller" element={<AddlController />} />
        <Route path="/examinations/controller" element={<ControllerUGPG />} />
        <Route path="/examinations/online-services" element={<OnlineServices />} />
        <Route path="/examinations/affiliated-colleges" element={<AffiliatedColleges />} />
        <Route path="/examinations/autonomous-colleges" element={<AutonomousColleges />} />

        {/* --- Accreditations --- */}
        <Route path="/accreditations" element={<Accreditations />} />
        <Route path="/accreditations/nss-report-2025" element={<NSSReport2025 />} />
        <Route path="/accreditations/nirf-engineering-2025" element={<NIRFEng2025 />} />
        <Route path="/accreditations/nirf-overall-2025" element={<NIRFOverall2025 />} />
        <Route path="/accreditations/ugc-12b" element={<UGC12B />} />
        <Route path="/accreditations/nirf-2020" element={<NIRF2020 />} />
        <Route path="/accreditations/student-satisfaction" element={<StudentSatisfaction />} />
        <Route path="/accreditations/aqar" element={<AQAR />} />
        <Route path="/accreditations/naac-ssr-2017" element={<NAACSSR2017 />} />
        <Route path="/accreditations/nirf-2022" element={<NIRF2022 />} />
        <Route path="/accreditations/aqar-2017-18" element={<AQAR2017 />} />
        <Route path="/accreditations/nirf-2023" element={<NIRF2023 />} />
        <Route path="/accreditations/naac-reports" element={<NAACReports />} />

        {/* --- Admissions & Contact --- */}
        <Route path="/admissions" element={<AcademicAdmission />} /> {/* Reusing component if path exists in both places or redirect */}
        <Route path="/contact" element={<Contact />} />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
