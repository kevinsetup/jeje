import Hidden from '@mui/material/Hidden';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

const FusePageCardedSidebar = forwardRef((props, ref) => {
  const { open, position, variant, rootRef, sidebarWidth } = props;

  const [isOpen, setIsOpen] = useState(open);

  useImperativeHandle(ref, () => ({
    toggleSidebar: handleToggleDrawer,
  }));

  const handleToggleDrawer = useCallback((val) => {
    setIsOpen(val);
  }, []);

  useEffect(() => {
    handleToggleDrawer(open);
  }, [handleToggleDrawer, open]);

  return (
    <>
      <Hidden lgUp={variant === 'permanent'} />
      {variant === 'permanent' && <Hidden lgDown />}
    </>
  );
});

FusePageCardedSidebar.defaultProps = {
  open: true,
};

export default FusePageCardedSidebar;
