import Dashboard from "@material-ui/icons/Dashboard";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Add from "@material-ui/icons/Add";
import FilterNone from "@material-ui/icons/FilterNone";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import Notifications from "@material-ui/icons/Notifications";
import CategoryIcon from "@material-ui/icons/Category";
import DescriptionIcon from "@material-ui/icons/Description";
import HelpCenterIcon from "@material-ui/icons/HelpOutline";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
const Routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
  },
  {
    path: "/banner",
    name: "Home Banner",
    icon: Add,
  },
  {
    path: "/blogs",
    name: "Blogs & News",
    icon: DescriptionIcon,
  },
  {
    path: "/category",
    name: "Category",
    icon: CategoryIcon,
  },

  {
    path: "/courses",
    name: "Courses",
    icon: VideoLibraryIcon,
  },
  {
    path: "/chapters",
    name: "Chapters",
    icon: FilterNone,
  },
  {
    path: "/faq-list",
    name: "F.A.Q",
    icon: LiveHelpIcon,
  },
  {
    path: "/orders",
    name: "Orders",
    icon: AttachMoneyIcon,
  },
  {
    path: "/products",
    name: "Products",
    icon: FilterNone,
  },
  {
    path: "/services",
    name: "Services",
    icon: SettingsApplicationsIcon,
  },
  {
    path: "/testinomials",
    name: "Testinomials",
    icon: FilterNone,
  },
  {
    path: "/files",
    name: "Add Files",
    icon: Add,
  },

  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
  },
  {
    path: "/queries",
    name: "Query",
    icon: HelpCenterIcon,
  },
];

export default Routes;
