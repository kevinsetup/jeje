import withReducer from "app/store/withReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import ArticleSharpIcon from "@mui/icons-material/ArticleSharp";
import Button from "@mui/material/Button";
import { useState } from "react";

import { faker } from "@faker-js/faker";

import NewRole from "./NewRole";
import EditRole from "./EditRole";
function TabOne() {
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
  const arrayRole = [
    {
      nomrol: "Administrador",
    },
    {
      nomrol: "Secretaria",
    },
    {
      nomrol: "Cliente",
    },
    {
      nomrol: "Cliente básico",
    },
  ];

  const [list, setList] = useState(arrayRole);
  const [openNewRole, setOpenNewRole] = useState(false);
  const [openEditRole, setOpenEditRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleOpenNewRole = () => {
    setOpenNewRole(true);
  };

  const handleOpenEditRole = (role) => {
    setSelectedRole(role)
    setOpenEditRole(true);

  };

  if (openNewRole) {
    return <NewRole setOpenNewRole={setOpenNewRole} />;
  }

  if (openEditRole) {
    return <EditRole role={selectedRole} setOpenEditRole={setOpenEditRole} />;
  }

  return (
    <FusePageSimple
      content={
        <div className="w-full px-24 pb-24">
          <div className=" w-full ">
            <div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">
              <motion.div variants={item} className="flex flex-col flex-auto">
                <div className="flex flex-row w-full justify-end mx-5">
                  <Button
                    onClick={() => handleOpenNewRole()}
                    className="whitespace-nowrap w-22"
                    variant="contained"
                    color="secondary"
                  >
                    Nuevo Rol
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
                          Rol
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
                      {list?.map((rol, i) => (
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
                              {rol.nomrol}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <ArticleSharpIcon
                              onClick={() => handleOpenEditRole(rol)}
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
        </div>
      }
    />
  );
}
export default TabOne;
