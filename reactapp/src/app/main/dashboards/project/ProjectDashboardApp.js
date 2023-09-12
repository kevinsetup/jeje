import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Input from '@mui/base/Input';
import ProjectDashboardAppHeader from './ProjectDashboardAppHeader';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import AddUsers from './Components/AddUsers';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledInputElement = styled('input')(
  ({ theme }) => `
  width: 150px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5rem;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 24px ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
function ProjectDashboardApp(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, setValue] = useState(null);

  const [addUsersView, setAddUsersView] = useState(false);

  const handleOpenAddUsers = () => {
    setAddUsersView(true);
    console.log(addUsersView);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  if (_.isEmpty(widgets)) {
    return null;
  }
  if (addUsersView) {
    return <AddUsers />;
  }

  return (
    <Root
      header={<ProjectDashboardAppHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <div className="flex space-x-8 justify-end">
            <div className="flex justify-center items-center space-x-7">
              <div>
                <h6>Registrar entrega del pedido </h6>
              </div>
              <div>
                <input type="date" className="MuiInput-input muiltr-1yz9qib" />
              </div>
            </div>
            <div>
              <Button
                onClick={handleOpenAddUsers}
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
              >
                Registrar pedido
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    N°
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Codigo
                  </th>

                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Cantidad
                  </th>

                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    los ultimos pedidos
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                    Foto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                <tr className="hover:bg-gray-50">
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">1</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">00000002</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700 ">ALF X 1 </td>
                  <td className="px-6 py-4 font-medium text-gray-700 ">S/ 1.10 </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Input slots={{ input: StyledInputElement }} {...props} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">30 - 60 - 100</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">2</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">00000002</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700 ">ALF X 1 CORAZON TAPER </td>
                  <td className="px-6 py-4 font-medium text-gray-700 ">S/ 1.10 </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Input slots={{ input: StyledInputElement }} {...props} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }
    />
  );
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);
