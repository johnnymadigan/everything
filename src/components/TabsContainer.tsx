"use client";
import { Tab } from "@mui/material";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import React, { useState } from "react";
import ShortForm from "./ShortForm";

// See https://mui.com/material-ui/react-tabs

type TabPanelProps = {
  children?: React.ReactNode;
  idx: number;
  value: number;
};

const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, idx, ...other } = props;
  const isHidden = value !== idx;

  return (
    <div
      role="tabpanel"
      hidden={isHidden}
      id={`simple-tabpanel-${idx}`}
      aria-labelledby={`simple-tab-${idx}`}
      className="border-2 border-stone-100 rounded-md min-h-[50vh]"
      {...other}
    >
      {value === idx && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// TODO: Learn more about accessability, what are the must haves?
const a11yProps = (idx: number) => {
  return {
    id: `simple-tab-${idx}`,
    "aria-controls": `simple-tabpanel-${idx}`,
  };
};

const TabsContainer = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: { xs: 320, sm: 480 },
        bgcolor: "background.paper",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        <Tab label="Short Form" {...a11yProps(0)} />
        <Tab label="Idea2" {...a11yProps(1)} />
        <Tab label="Idea3" {...a11yProps(2)} />
        <Tab label="Idea4" {...a11yProps(3)} />
        <Tab label="Idea5" {...a11yProps(4)} />
        <Tab label="Idea6" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} idx={0}>
        <ShortForm />
      </TabPanel>
      <TabPanel value={value} idx={1} />
      <TabPanel value={value} idx={2} />
      <TabPanel value={value} idx={3} />
      <TabPanel value={value} idx={4} />
      <TabPanel value={value} idx={5} />
    </Box>
  );
};

export default TabsContainer;
