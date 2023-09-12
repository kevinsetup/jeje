import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import { selectUser } from 'app/store/userSlice';
import { getProjects, selectProjects } from './store/projectsSlice';

function ProjectDashboardAppHeader(props) {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const user = useSelector(selectUser);

  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    menuEl: null,
  });

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  function handleChangeProject(id) {
    setSelectedProject({
      id,
      menuEl: null,
    });
  }

  function handleOpenProjectMenu(event) {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: event.currentTarget,
    });
  }

  function handleCloseProjectMenu() {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: null,
    });
  }

  if (_.isEmpty(projects)) {
    return null;
  }

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex items-center" />
    </div>
  );
}

export default ProjectDashboardAppHeader;
