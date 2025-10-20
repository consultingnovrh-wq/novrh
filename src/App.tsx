import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import CVTheque from "./pages/CVTheque";
import AddCV from "./pages/AddCV";
import Formation from "./pages/Formation";
import Companies from "./pages/Companies";
import Opportunities from "./pages/Opportunities";
import ClassifiedAds from "./pages/ClassifiedAds";
import Newsletter from "./pages/Newsletter";
import AddCompany from "./pages/AddCompany";
import AddOpportunity from "./pages/AddOpportunity";
import AddClassified from "./pages/AddClassified";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import StudentServices from "./pages/StudentServices";
import CompanyServices from "./pages/CompanyServices";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTest from "./pages/AdminTest";
import AdminUsers from "./pages/AdminUsers";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminCompanies from "./pages/AdminCompanies";
import AdminJobs from "./pages/AdminJobs";
import AdminCandidates from "./pages/AdminCandidates";
import AdminTeam from "./pages/AdminTeam";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import AdminPayments from "./pages/AdminPayments";
import AdminQuoteRequests from "./pages/AdminQuoteRequests";
import AdminFormations from "./pages/AdminFormations";
import QuoteRequest from "./pages/QuoteRequest";
import RecruiterSubscription from "./pages/RecruiterSubscription";
import TrainingInstitution from "./pages/TrainingInstitution";
import Reviews from "./pages/Reviews";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-company" element={<Register />} />
          <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/cvtheque" element={<CVTheque />} />
          <Route path="/add-cv" element={<AddCV />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/classified-ads" element={<ClassifiedAds />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/add-opportunity" element={<AddOpportunity />} />
          <Route path="/add-classified" element={<AddClassified />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-services" element={<StudentServices />} />
          <Route path="/company-services" element={<CompanyServices />} />
          
          {/* Nouvelles fonctionnalités */}
          <Route path="/quote-request" element={<QuoteRequest />} />
          <Route path="/recruiter-subscription" element={<RecruiterSubscription />} />
          <Route path="/training-institution" element={<TrainingInstitution />} />
          <Route path="/reviews" element={<Reviews />} />
          
          {/* Pages légales */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Routes d'administration */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-test" element={<AdminTest />} />
          
          {/* Gestion des utilisateurs */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/all" element={<AdminUsers />} />
          <Route path="/admin/users/candidates" element={<AdminUsers />} />
          <Route path="/admin/users/companies" element={<AdminUsers />} />
          <Route path="/admin/users/students" element={<AdminUsers />} />
          <Route path="/admin/users/pending" element={<AdminUsers />} />
          <Route path="/admin/users/disabled" element={<AdminUsers />} />
          
          {/* Gestion des abonnements */}
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/subscriptions/all" element={<AdminSubscriptions />} />
          <Route path="/admin/subscriptions/active" element={<AdminSubscriptions />} />
          <Route path="/admin/subscriptions/payments" element={<AdminSubscriptions />} />
          <Route path="/admin/subscriptions/invoices" element={<AdminSubscriptions />} />
          <Route path="/admin/subscriptions/refunds" element={<AdminSubscriptions />} />
          
          {/* Gestion des paiements */}
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/payments/all" element={<AdminPayments />} />
          <Route path="/admin/payments/completed" element={<AdminPayments />} />
          <Route path="/admin/payments/pending" element={<AdminPayments />} />
          <Route path="/admin/payments/failed" element={<AdminPayments />} />
          <Route path="/admin/payments/refunded" element={<AdminPayments />} />
          
          {/* Gestion des demandes de devis */}
          <Route path="/admin/quote-requests" element={<AdminQuoteRequests />} />
          <Route path="/admin/quote-requests/all" element={<AdminQuoteRequests />} />
          <Route path="/admin/quote-requests/pending" element={<AdminQuoteRequests />} />
          <Route path="/admin/quote-requests/completed" element={<AdminQuoteRequests />} />
          
          {/* Gestion des entreprises */}
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/companies/all" element={<AdminCompanies />} />
          <Route path="/admin/companies/verified" element={<AdminCompanies />} />
          <Route path="/admin/companies/pending" element={<AdminCompanies />} />
          <Route path="/admin/companies/premium" element={<AdminCompanies />} />
          <Route path="/admin/companies/stats" element={<AdminCompanies />} />
          
          {/* Gestion des offres d'emploi */}
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/all" element={<AdminJobs />} />
          <Route path="/admin/jobs/active" element={<AdminJobs />} />
          <Route path="/admin/jobs/expired" element={<AdminJobs />} />
          <Route path="/admin/jobs/pending" element={<AdminJobs />} />
          <Route path="/admin/jobs/stats" element={<AdminJobs />} />
          
          {/* Gestion des candidats */}
          <Route path="/admin/candidates" element={<AdminCandidates />} />
          <Route path="/admin/candidates/all" element={<AdminCandidates />} />
          <Route path="/admin/candidates/cv-pending" element={<AdminCandidates />} />
          <Route path="/admin/candidates/verified" element={<AdminCandidates />} />
          <Route path="/admin/candidates/premium" element={<AdminCandidates />} />
          <Route path="/admin/candidates/stats" element={<AdminCandidates />} />
          
          {/* Gestion de l'équipe admin */}
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/team/all" element={<AdminTeam />} />
          <Route path="/admin/team/add" element={<AdminTeam />} />
          <Route path="/admin/team/roles" element={<AdminTeam />} />
          <Route path="/admin/team/logs" element={<AdminTeam />} />
          
          {/* Rapports et statistiques */}
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/reports/dashboard" element={<AdminReports />} />
          <Route path="/admin/reports/users" element={<AdminReports />} />
          <Route path="/admin/reports/revenue" element={<AdminReports />} />
          <Route path="/admin/reports/activity" element={<AdminReports />} />
          <Route path="/admin/reports/exports" element={<AdminReports />} />
          
          {/* Paramètres système */}
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/settings/general" element={<AdminSettings />} />
          <Route path="/admin/settings/security" element={<AdminSettings />} />
          <Route path="/admin/settings/notifications" element={<AdminSettings />} />
          <Route path="/admin/settings/integrations" element={<AdminSettings />} />
          <Route path="/admin/settings/database" element={<AdminSettings />} />
          
          {/* Autres routes d'administration (à implémenter) */}
          <Route path="/admin/formations" element={<AdminFormations />} />
          <Route path="/admin/formations/all" element={<AdminFormations />} />
          <Route path="/admin/formations/active" element={<AdminFormations />} />
          <Route path="/admin/formations/popular" element={<AdminFormations />} />
          <Route path="/admin/formations/enrollments" element={<AdminFormations />} />
          <Route path="/admin/formations/stats" element={<AdminFormations />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
