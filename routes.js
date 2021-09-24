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
    path: "/blog",
    name: "Add News Update",
    icon: Add,
  },

  {
    path: "/course",
    name: "Add New Course",
    icon: Add,
  },
  {
    path: "/chapter",
    name: "Add Course Chapter",
    icon: Add,
  },
  {
    path: "/service",
    name: " Add New Service",
    icon: Add,
  },

  {
    path: "/testinomial",
    name: "Add Testinomial",
    icon: Add,
  },
  {
    path: "/category",
    name: "Category",
    icon: FilterNone,
  },

  {
    path: "/blogs",
    name: "News List",
    icon: FilterNone,
  },
  {
    path: "/courses",
    name: "Courses List",
    icon: FilterNone,
  },

  {
    path: "/testinomials",
    name: "Testinomial List",
    icon: FilterNone,
  },

  {
    path: "/services",
    name: "Services List",
    icon: FilterNone,
  },

  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
  },
];

export default Routes;
