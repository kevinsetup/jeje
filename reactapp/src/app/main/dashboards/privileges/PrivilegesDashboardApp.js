import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useState } from 'react';
import TabOne from './components/TabOne';

function PrivilegesDashboardApp() {
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
  return (
    <FusePageSimple
      content={
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TabList
                onChange={handleChange}
              >
                <Tab label="Roles" value="1" />
                <Tab label="Privilegios" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
                <TabOne/>
            </TabPanel>
            <TabPanel value="2">
            </TabPanel>
          </TabContext>
        </Box>
      }
    />
  );
}

export default PrivilegesDashboardApp;
