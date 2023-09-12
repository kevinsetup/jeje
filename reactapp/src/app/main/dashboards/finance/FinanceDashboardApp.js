import withReducer from "app/store/withReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import ArticleSharpIcon from "@mui/icons-material/ArticleSharp";
import Button from "@mui/material/Button";
import reducer from "./store";
import { getWidgets, selectWidgets } from "./store/widgetsSlice";
import { useState } from "react";

import NewUser from "./components/NewUser";
import EditUser from "./components/EditUser";
import { faker } from "@faker-js/faker";

function WidgetTable({ widgets }) {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  const [list, setList] = useState(generateUsers(30));
  const [selectedUser, setSelectedUser] = useState(null);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);

  const handleOpenNewUser = () => {
    setOpenNewUser(true);
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user)
    setOpenEditUser(true);
  };

  if (openNewUser) {
    return <NewUser setOpenNewUser={setOpenNewUser} />;
  }

  if (openEditUser) {
    return <EditUser user={selectedUser} setOpenEditUser={setOpenEditUser} />;
  }

  function generateData() {
    return {
      username: faker.person.firstName(),
      lastName: faker.person.lastName(),
      tipo_usuario: faker.helpers.arrayElement(["Responsable", "Vendedor"]),
      estado: faker.helpers.arrayElement([true, false]),
      rol: faker.helpers.arrayElement(['Administrador', 'Secretaria', 'Cliente', 'Cliente Basico']),
      password: faker.phone.imei()
    };
  }

  function generateUsers(n) {
    const orders = [];
    for (let i = 0; i < n; i += 1) {
      orders.push(generateData());
    }
    return orders;
  }

  return (
    !_.isEmpty(widgets) && (
      <motion.div
        className="w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className=" w-full ">
          <div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">
            <motion.div variants={item} className="flex flex-col flex-auto">
            <div className="flex flex-row w-full justify-end">
            <Button
                      onClick={() => handleOpenNewUser()}
                      className="whitespace-nowrap w-22"
                      variant="contained"
                      color="secondary"
                    >
                      Nuevo Usuario
                    </Button>
            </div>
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 font-medium text-gray-900"
                      >
                        N°
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-medium text-gray-900"
                      >
                        Login
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-4 font-medium text-gray-900"
                      >
                        Tipo usuario
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-medium text-gray-900"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 font-medium text-gray-900"
                      >
                        Opciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    {list?.map((user, i) => (
                      <tr className="hover:bg-gray-50" key={i}>
                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                          <div className="text-sm">
                            <div className="font-medium text-gray-700">
                              {++i}
                            </div>
                          </div>
                        </th>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-700">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 ">
                          {user.tipo_usuario}{" "}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 ">
                          {user.estado ? 'Activo' :'Inactivo'}
                        </td>
                        <td className="px-6 py-4">
                          <ArticleSharpIcon
                            onClick={() => handleOpenEditUser(user)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  );
}

function FinanceDashboardApp(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24">
          <WidgetTable widgets={widgets} />
        </div>
      }
    />
  );
}

export default withReducer("financeDashboardApp", reducer)(FinanceDashboardApp);
