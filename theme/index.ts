import { extendTheme } from "@chakra-ui/react";

import Alert from "./alert";
import Modal from "./modal";
import Badge from "./badge";
import Tooltip from "./tooltip";
import Text from "./text";
import Button from "./button";
import Tabs from "./tabs";
import Table from "./table";
import NumberInput from "./numberInput";
import Heading from "./heading";
import Menu from "./menu";
import List from "./list";
import Slider from "./slider";
import Input from "./input";
import Popover from "./popover";
import Checkbox from "./checkbox";
import Accordion from "./accordion";

export default extendTheme({
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Inter', sans-serif",
  },
  components: {
    Alert,
    Accordion,
    Modal,
    Tooltip,
    Text,
    Badge,
    Button,
    Heading,
    Input,
    NumberInput,
    List,
    Slider,
    Table,
    Tabs,
    Menu,
    Popover,
    Checkbox,
  },
  colors: {
    green: { 500: "#7FE6A2" },
    red: { 500: "#EF5177" },
    white: {
      50: "rgba(255,255,255,0.05)",
      80: "rgba(255,255,255,0.08)",
      100: "rgba(255,255,255,0.1)",
      200: "rgba(255,255,255,0.2)",
      300: "rgba(255,255,255,0.3)",
      400: "rgba(255,255,255,0.4)",
      500: "rgba(255,255,255,0.5)",
      600: "rgba(255,255,255,0.6)",
      700: "rgba(255,255,255,0.7)",
      800: "rgba(255,255,255,0.8)",
      900: "rgba(255,255,255,0.9)",
    },
    black: {
      200: "rgba(0,0,0,0.2)",
    },
    tile: {
      dark: "rgba(0,13,55,0.8)",
      turquoise: "rgba(89,183,221,0.8)",
      blue: "rgba(22,41,230,0.8)",
    },
    brand: {
      purple: "#5643F2",
      lightPurple: "#83B3FD",
      teal: "#A1F4EF",
      dark: "#000D37",
      turquoise: "#A1F4EF",
      blue: "#1629E6",
      lightBlue: "rgba(131,179,253,0.3)",
      deepBlue: "#000D37",
      overlay: "#C2D9FF",
    },
  },
  textStyles: {
    h3: {
      fontWeight: "medium",
      fontSize: "xl",
      lineHeight: 1.6,
    },
    minibutton: {
      fontWeight: "bold",
      fontSize: "2xs",
      lineHeight: "1.2",
      letterSpacing: "0.18rem",
      textTransform: "uppercase",
    },
    medium: {
      fontWeight: "medium",
      fontSize: "sm",
      lineHeight: "16px",
    },
    small: {
      fontWeight: "medium",
      fontSize: "xs",
      lineHeight: "shorter",
    },
  },
});
