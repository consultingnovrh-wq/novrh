import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight, Crown, Star, Building2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { useDynamicActions } from "@/hooks/use-dynamic-actions";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from "@/assets/logo.png";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { userSubscription, getCurrentPlanName, hasActiveSubscription } = useSubscription();
  const { 
    isAuthenticated, 
    userType, 
    handleDashboard, 
    handleLogout, 
    handleLogin, 
    handleRegister,
    handlePostJob,
    handleAddCV,
    handleViewCVTheque,
    handleAddCompany
  } = useDynamicActions();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigation = [
    { name: "ACCUEIL", href: "/" },
    { name: "TARIFS", href: "/pricing" },
  ];

  const mobileMenuItems = [
    {
      name: "OFFRES D'EMPLOI",
      href: "/jobs",
      submenu: [
        { name: "Espace employeur", href: "/employer-dashboard" },
        { name: "Espace candidat", href: "/candidate-dashboard" },
      ]
    },
    {
      name: "CVTHÈQUE",
      href: "/cvtheque",
      submenu: [
        { name: "Consulter CVthèque", href: "/cvtheque" },
        { name: "Ajouter mon CV", href: "/add-cv" },
      ]
    },
    {
      name: "FORMATION",
      href: "/formation",
      submenu: [
        { name: "Consulter les formations", href: "/formation" },
        { name: "Proposer une formation", href: "/add-formation" },
      ]
    },
    {
      name: "À PROPOS DE NOS ENTREPRISES",
      href: "/companies",
      submenu: [
        { name: "Découvrir nos entreprises", href: "/companies" },
        { name: "Présenter votre entreprise", href: "/add-company" },
      ]
    },
  ];

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  return (
    <header className="fixed top-0 w-full bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src={logo} alt="NovRH CONSULTING Logo" className="h-12 w-auto md:h-20" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="/" className="text-xs font-medium text-[#00167a] hover:bg-[#00167a]/10 hover:text-[#00167a] transition-colors px-2 py-1 rounded-md">
              ACCUEIL
            </a>
            
            <a href="/pricing" className="text-xs font-medium text-[#00167a] hover:bg-[#00167a]/10 hover:text-[#00167a] transition-colors px-2 py-1 rounded-md">
              TARIFICATION
            </a>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-medium text-[#00167a] hover:bg-[#00167a]/10 hover:text-[#00167a] transition-colors px-2 py-1 rounded-md">
                    OFFRES D'EMPLOI
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 bg-[hsl(221,83%,25%)] text-white rounded-lg">
                      <NavigationMenuLink asChild>
                        <a href="/employer-dashboard" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Espace Employeur</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Accédez à votre espace employeur
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="/candidate-dashboard" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Espace Candidat</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Accédez à votre espace candidat
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-medium text-[#00167a] hover:bg-[#00167a]/10 hover:text-[#00167a] transition-colors px-2 py-1 rounded-md">
                    CVTHÈQUE
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[350px] gap-3 p-4 bg-[hsl(221,83%,25%)] text-white rounded-lg">
                      <NavigationMenuLink asChild>
                        <a href="/cvtheque" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Consulter CVthèque</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Parcourez les profils disponibles (sous conditions)
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="/add-cv" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Ajouter mon CV</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Déposez votre CV gratuitement
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-medium text-[#00167a] hover:bg-[#00167a]/10 hover:text-[#00167a] transition-colors px-2 py-1 rounded-md">
                    FORMATION
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[350px] gap-3 p-4 bg-[hsl(221,83%,25%)] text-white rounded-lg">
                      <NavigationMenuLink asChild>
                        <a href="/formation" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Consulter les Formations</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Découvrez nos programmes de formation
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="/add-formation" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Proposer une Formation</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ajoutez votre formation à notre catalogue
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-medium text-[#00167a] hover:bg-[#00167a]/10 hover:text-[#00167a] transition-colors px-2 py-1 rounded-md">
                    À PROPOS DE NOS ENTREPRISES
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 bg-[hsl(221,83%,25%)] text-white rounded-lg">
                      <NavigationMenuLink asChild>
                        <a href="/companies" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Découvrir nos Entreprises</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explorez nos entreprises partenaires
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a href="/add-company" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[hsl(221,83%,35%)] hover:text-white focus:bg-[hsl(221,83%,35%)] focus:text-white">
                          <div className="text-sm font-medium leading-none">Présenter votre Entreprise</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ajoutez votre entreprise à notre réseau
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs font-medium bg-[#00167a] text-white hover:bg-[#00167a]/90 border-none shadow-none px-3 py-1 h-8">
                    {user ? 'Mon Compte' : 'Mon Compte'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-1 p-2 bg-white border rounded-lg shadow-lg">
                      {user ? (
                        <>
                          <div className="p-3 border-b">
                            <div className="flex items-center space-x-2">
                              {hasActiveSubscription() ? (
                                <>
                                  {getCurrentPlanName() === 'Premium' && <Star className="w-4 h-4 text-purple-600" />}
                                  {getCurrentPlanName() === 'Entreprise' && <Crown className="w-4 h-4 text-yellow-600" />}
                                  {getCurrentPlanName() === 'Basique' && <Building2 className="w-4 h-4 text-blue-600" />}
                                  {getCurrentPlanName() === 'Gratuit' && <User className="w-4 h-4 text-gray-600" />}
                                  <span className="text-sm font-medium text-gray-900">
                                    Plan {getCurrentPlanName()}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <User className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-900">Plan Gratuit</span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                          </div>
                          
                          <NavigationMenuLink asChild>
                            <button 
                              onClick={handleDashboard}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Tableau de bord</div>
                            </button>
                          </NavigationMenuLink>
                          
                          <NavigationMenuLink asChild>
                            <a href="/pricing" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                              <div className="text-sm font-medium leading-none text-gray-900">Gérer l'abonnement</div>
                            </a>
                          </NavigationMenuLink>
                          
                          <NavigationMenuLink asChild>
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Se déconnecter</div>
                            </button>
                          </NavigationMenuLink>
                        </>
                      ) : (
                        <>
                          <NavigationMenuLink asChild>
                            <button 
                              onClick={handleLogin}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Se connecter</div>
                            </button>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <button 
                              onClick={handleRegister}
                              className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">S'inscrire</div>
                            </button>
                          </NavigationMenuLink>
                        </>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="bg-[#00167a] text-white hover:bg-[#00167a]/90 border-none shadow-none"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#00167a] text-white rounded-t-2xl p-0">
                <DrawerHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center">
                    <img src={logo} alt="NovRH CONSULTING Logo" className="h-12 w-auto" />
                    <span className="ml-3 text-white font-semibold">Bienvenue</span>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <X className="h-6 w-6" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <nav className="flex flex-col gap-1 px-4 pb-4">
                  <a href="/" className="text-base font-medium text-white hover:bg-[#00167a]/80 px-3 py-2 rounded transition-colors">ACCUEIL</a>
                  <a href="/pricing" className="text-base font-medium text-white hover:bg-[#00167a]/80 px-3 py-2 rounded transition-colors">TARIFICATION</a>
                  
                  {mobileMenuItems.map((item) => (
                    <div key={item.name}>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="w-full text-left text-base font-medium text-white hover:bg-[#00167a]/80 px-3 py-2 rounded transition-colors flex items-center justify-between"
                      >
                        {item.name}
                        {item.submenu && (
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform ${
                              openSubmenu === item.name ? 'rotate-90' : ''
                            }`}
                          />
                        )}
                      </button>
                      
                      {item.submenu && openSubmenu === item.name && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-sm text-white/90 hover:bg-[#00167a]/60 px-3 py-2 rounded transition-colors"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 flex flex-col gap-2">
                    <Button variant="default" size="sm" className="w-full bg-white text-[#00167a] hover:bg-[#00167a] hover:text-white border-none shadow-none" asChild>
                      <a href="/login">Mon Compte</a>
                    </Button>
                  </div>
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;