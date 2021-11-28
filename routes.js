import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Add from "@material-ui/icons/Add";
import FilterNone from "@material-ui/icons/FilterNone";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";

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
    icon: FilterNone,
  },
  {
    path: "/category",
    name: "Category",
    icon: FilterNone,
  },

  {
    path: "/courses",
    name: "Courses",
    icon: FilterNone,
  },
  {
    path: "/chapters",
    name: "Chapters",
    icon: FilterNone,
  },
  {
    path: "/faq-list",
    name: "F.A.Q",
    icon: FilterNone,
  },
  {
    path: "/orders",
    name: "Orders",
    icon: FilterNone,
  },
  {
    path: "/products",
    name: "Products",
    icon: FilterNone,
  },
  {
    path: "/services",
    name: "Services",
    icon: FilterNone,
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
];

export default Routes;
