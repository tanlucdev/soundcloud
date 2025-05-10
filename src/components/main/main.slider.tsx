
'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from "next/link";

interface IProps {
  data: ITrackTop[],
  title: string;
}
const MainSlider = (props: IProps) => {
  const NextArrow = (props: any) => {
    return (
      <Button color='inherit' variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 0,
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    )
  }

  const PrevArrow = (props: any) => {
    return (
      <Button color='inherit' variant="contained" onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    )
  }

  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  //box === div
  return (

    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",

          "img": {
            height: 150,
            width: 150,
          }
        },
        "h3": {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2>{props.title}</h2>
      <Slider {...settings}>
        {props.data.map((item, index) => {
          return (
            <Link href={`/track/${item._id}?audio=${item.trackUrl}`} key={index}>
              <div className="track" key={item._id}>
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`} alt="" />
                <h4>{item.title}</h4>
                <h5>{item.description}</h5>
              </div>
            </Link>
          )
        })}
      </Slider>
      <Divider />
    </Box>

  );
}

export default MainSlider;