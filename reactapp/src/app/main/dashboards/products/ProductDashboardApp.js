import FusePageSimple from "@fuse/core/FusePageSimple";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { faker } from "@faker-js/faker";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import {
  Box,
  Divider,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Cake,
  BreakfastDining,
  RoomService,
  Icecream,
  Flatware,
  Cookie,
} from "@mui/icons-material";
import { environment } from "src/environment/environment";
import axios from "axios";
import { formatCurrency } from "../../utils/formatCurrency";

const ProductDashboardApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, setValue] = useState(null);

  const [addUsersView, setAddUsersView] = useState(false);
  const [category, setCategory] = useState(null);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleOpenAddUsers = () => {
    setAddUsersView(true);
    console.log(addUsersView);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setAnchorEl(null);
  };
  const handleAddToCart = (product) => {
    const newCartItems = [...cartItems];
    const itemInCart = newCartItems.find(
      (item) => item.product.name === product.name
    );

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      newCartItems.push({ product, quantity: 1 });
    }

    setCartItems(newCartItems);
  };

  useEffect(() => {
    // const generateProducts = new Array(10).fill().map(() => ({
    //   name: faker.commerce.productName(),
    //   category: faker.commerce.productAdjective(),
    //   price: faker.commerce.price(),
    //   image: `https://picsum.photos/seed/${faker.datatype.uuid()}/200/300`,
    // }));
    // setProducts(generateProducts);
    fetchAllProducts();
  }, []);

  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const fetchAllProducts = async () => {
    try {
      const apiUrl = environment.apiUrl + "Producto/GetProductos";
      const { data } = await axios.get(apiUrl);
      console.log(data);
      setProducts(data.data);
    } catch (err) {
      console.log("Error in fetchAllProducts()", err);
    }
  };

  const fetchProductsByCategory = async () => {
    try {
    } catch {}
  };

  return (
    <FusePageSimple
      content={
        <div className="w-full p-24 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0 flex flex-col">
          <div className="flex flex-row justify-start items-center space-x-60 mb-24 ">
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={handleSearchChange}
            />

            <Badge
              badgeContent={cartItems.length}
              color="error"
              onClick={handleCartClick}
            >
              <ShoppingCartIcon />
            </Badge>
          </div>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCartClose}
          >
            {cartItems.length === 0 ? (
              <MenuItem onClick={handleCartClose}>
                El carrito está vacío
              </MenuItem>
            ) : (
              cartItems.map((item, index) => (
                <MenuItem onClick={handleCartClose} key={index}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      // src={item.product.image}
                      alt={item.product.descripcionProducto}
                      style={{ height: "40px", marginRight: "10px" }}
                    />
                    {item.product.descripcionProducto} - {formatCurrency(item.product.valor_Unitario)} x{" "}
                    {item.quantity}
                  </div>
                </MenuItem>
              ))
            )}
            <MenuItem>
              <Button variant="contained" color="primary">
                Continuar con la compra
              </Button>
            </MenuItem>
          </Menu>

          <div className="w-full flex gap-x-12">
            <Grid container spacing={2}>
              {products
                .filter((product) =>
                  product.descripcionProducto.toLowerCase().includes(search.toLowerCase())
                )
                .map((product, index) => (
                  <Grid item key={index} xs={12} sm={6} md={3}>
                    <Card
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        // image={product.image}
                        alt={product.descripcionProducto}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <CardContent style={{ flexGrow: 1 }}>
                        <Typography variant="h7" component="div">
                          {product.descripcionProducto}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(product.valor_Unitario)}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToCart(product)}
                          style={{ marginTop: "10px" }} // esto añade un margen en la parte superior para separarlo del precio
                        >
                          Añadir al carrito
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Box sx={{ minWidth: "240px", bgcolor: "background.paper" }}>
              <nav aria-label="main mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary="Categoría de productos" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
              <Divider />
              <nav aria-label="secondary mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <BreakfastDining />
                      </ListItemIcon>
                      <ListItemText primary="Panes" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Cake />
                      </ListItemIcon>
                      <ListItemText primary="Cakes" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a">
                      <ListItemIcon>
                        <RoomService />
                      </ListItemIcon>
                      <ListItemText primary="Campañas" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a">
                      <ListItemIcon>
                        <Icecream />
                      </ListItemIcon>
                      <ListItemText primary="Extras" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a">
                      <ListItemIcon>
                        <Cookie />
                      </ListItemIcon>
                      <ListItemText primary="Donas" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a">
                      <ListItemIcon>
                        <Flatware />
                      </ListItemIcon>
                      <ListItemText primary="Pionono" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Box>
          </div>
        </div>
      }
    />
  );
};

export default ProductDashboardApp;
