import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { environment } from 'src/environment/environment';
import axios from 'axios';
import reducer from './store';
import { getWidgets } from './store/widgetsSlice';
import TabOne from './Components/TabOne';
import TabTwo from './Components/TabTwo';
import TabThree from './Components/TabThree';
import permissions from '../../utils/permissions';
import { formatDateForAPI } from '../../utils/formatDate';
import TabFour from './Components/TabFour';

function AnalyticsDashboardApp() {
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const [showPrices, setShowPrices] = useState(false);
  const [showCancelados, setShowCancelados] = useState(false);
  const { apiUrl } = environment;

  const getOneMonthBefore = (date) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    return newDate;
  };

  const [datePick, setDatePick] = useState({
    from: getOneMonthBefore(new Date()),
    to: new Date(),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  const [orders, setOrders] = useState([]);

  const getPedidosByDate = async (hasPermission) => {
    console.log(hasPermission);

    try {
      const url = `${apiUrl}Pedido/GetPedidosByDate`;
      console.log();
      const { data } = await axios.get(url, {
        params: {
          fechaInicio: formatDateForAPI(datePick.from),
          fechaFin: formatDateForAPI(datePick.to),
          hasPermission,
        },
      });
      console.log(data.data);
      setOrders(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkPermission = async () => {
    try {
      const url = `${apiUrl}Permisos/CheckUserPermission`;
      const { data } = await axios.get(url, {
        params: { IdPermiso: permissions.VER_PRECIOS },
      });
      setShowPrices(data.data.result);
      return data.data.result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const checkPermissionViewCancelados = async () => {
    try {
      const url = `${apiUrl}Permisos/CheckUserPermission`;
      const { data } = await axios.get(url, {
        params: { IdPermiso: permissions.VER_CANCELADOS },
      });
      console.log(data.data.result);
      setShowCancelados(data.data.result);
      return data.data.result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const fetchData = async () => {
    const hasPermission = await checkPermission();
    await checkPermissionViewCancelados();
    await getPedidosByDate(hasPermission);
  };

  const handleNewOrder = (value) => {
    fetchData();
  };

  const handleUpdateOrder = (value) => {
    fetchData();
  };

  const handleDateChange = (datePick) => {
    setDatePick(datePick);
  };

  const searchOrders = async () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FusePageSimple
      content={
        <Box
          sx={{
            width: '100%',
            typography: 'body1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          className="mt-10"
        >
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <TabList
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                onChange={handleChange}
              >
                <Tab label="Pedidos Creados" value="1" />
                <Tab label="Pedidos Confirmados" value="2" />
                <Tab label="Pedidos Enviados" value="4" />
                {showCancelados && <Tab label="Pedidos Cancelados" value="5" />}
              </TabList>
            </Box>
            <TabPanel value="1">
              <TabOne
                orders={orders}
                showPrices={showPrices}
                handleNewOrder={handleNewOrder}
                handleUpdateOrder={handleUpdateOrder}
                datePick={datePick}
                onChangeDatePick={handleDateChange}
                onSearch={searchOrders}
                updateList={handleNewOrder}
              />
            </TabPanel>
            <TabPanel value="2">
              <TabTwo showPrices={showPrices} />
            </TabPanel>

            <TabPanel value="4">
              <TabThree showPrices={showPrices} />
            </TabPanel>
            {showCancelados && (
              <TabPanel value="5">
                <TabFour showPrices={showPrices} />
              </TabPanel>
            )}
          </TabContext>
        </Box>
      }
    />
  );
}

export default withReducer('analyticsDashboardApp', reducer)(AnalyticsDashboardApp);
