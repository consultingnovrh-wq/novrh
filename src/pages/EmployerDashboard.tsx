import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, BarChart, Plus, Search, Eye, Edit, Trash2 } from "lucide-react";

const EmployerDashboard = () => {
  const stats = [
    { title: "Offres publiées", value: "12", icon: <FileText className="h-6 w-6" /> },
    { title: "Candidatures reçues", value: "156", icon: <Users className="h-6 w-6" /> },
    { title: "Profils consultés", value: "89", icon: <Eye className="h-6 w-6" /> },
    { title: "Taux de conversion", value: "23%", icon: <BarChart className="h-6 w-6" /> }
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Développeur Full Stack",
      status: "active",
      applications: 24,
      views: 156,
      posted: "2024-01-15"
    },
    {
      id: 2,
      title: "Chef de Projet RH",
      status: "active",
      applications: 18,
      views: 89,
      posted: "2024-01-10"
    },
    {
      id: 3,
      title: "Comptable Senior",
      status: "closed",
      applications: 32,
      views: 203,
      posted: "2024-01-05"
    }
  ];

  const recentApplications = [
    {
      id: 1,
      candidate: "Mariam Diallo",
      position: "Développeur Full Stack",
      status: "En attente",
      date: "2024-01-20"
    },
    {
      id: 2,
      candidate: "Ousmane Traoré",
      position: "Chef de Projet RH",
      status: "En cours",
      date: "2024-01-19"
    },
    {
      id: 3,
      candidate: "Fatoumata Keita",
      position: "Développeur Full Stack",
      status: "Refusée",
      date: "2024-01-18"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Espace Employeur</h1>
              <p className="text-blue-100">Gérez vos offres d'emploi et vos candidatures</p>
            </div>
            <Button className="bg-white text-blue-900 hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Publier une offre
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Offres d'emploi récentes</CardTitle>
                  <Button variant="outline" size="sm">
                    Voir toutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status === 'active' ? 'Active' : 'Fermée'}
                          </span>
                          <span>{job.applications} candidatures</span>
                          <span>{job.views} vues</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Candidatures récentes</CardTitle>
                  <Button variant="outline" size="sm">
                    Voir toutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{application.candidate}</h4>
                        <p className="text-sm text-gray-600">{application.position}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            application.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                          <span>{application.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Publier une offre</h3>
                <p className="text-gray-600 text-sm">Créez et publiez une nouvelle offre d'emploi</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rechercher des profils</h3>
                <p className="text-gray-600 text-sm">Consultez notre CVthèque pour trouver des candidats</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600 text-sm">Consultez les statistiques de vos offres</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EmployerDashboard; 