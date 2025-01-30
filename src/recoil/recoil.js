import { atom } from "recoil";

export const USERDATA = atom({
  key: "userData",
  default: undefined,
});

export const DASHBOARDDATA = atom({
  key: "dashboardData",
  default: undefined,
});

export const LINKSDATA = atom({
  key: "linksData",
  default: undefined,
});

export const ANALYTICSDATA = atom({
  key: "analyticsData",
  default: undefined,
});

export const ANALYTICSEARCH = atom({
  key: "analyticsSearch",
  default: '',
})

export const LINKSEARCH = atom({
  key: "linkSearch",
  default: '',
})

export const LINKPAGE = atom({
  key: "linkPage",
  default: 1,
})

export const ANALYTICPAGE = atom({
  key: "analyticsPage",
  default: 1,
})

export const NAVOPEN = atom({
  key: "navOpen",
  default: true,
})