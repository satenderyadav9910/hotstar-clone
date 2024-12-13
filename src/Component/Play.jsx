import { Flex, Text } from "@chakra-ui/layout";
import axios from "axios";
import { async } from "q";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import YouTube from "react-youtube";
import { addToContinue, getSimilar } from "../Redux/movies/action";
import CardCarousel from "./Carousel/CardCarousel";
export default function Play() {
  const parms = useParams();
  const [results, setResults] = useState();
  useEffect(() => {
    getKey();
    return () => {};
  }, []);
  const getKey = async () => {
    let url = `https://api.themoviedb.org/3/${parms.type}/${parms.id}/videos?api_key=ac3ffb9076cbecea4fb68f53b263a01d&language=en-US`;
    let res = await axios.get(url);
    console.log(res.data.results[0]);
    setResults(res.data.results[0]);
  };
  const similar = useSelector((state) => state.movieReducer.similar);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSimilar({ id: parms.id, key: "similar" }));
    addToContinue(parms.id);
    return () => {};
  }, [parms.id]);
  const opts = {
    width: "100%",
    height: "660",
    color: "white",
    autoplay: 1,
    modestbranding: 1,
  };
  return (
    <Flex w="100%" pt={"90px"} direction="column">
      {results ? (
        <>
          <YouTube
            videoId={results.key}
            opts={opts}
            style={{ width: "100%" }}
          />
          <Text
            color={"white"}
            fontSize="38px"
            pt={"25px"}
            margin={"0 calc(1.5% + 10px)"}>
            {results.name}
          </Text>
          <Text
            color={"whiteAlpha.800"}
            fontSize="22px"
            pt={"5px"}
            margin={"0 calc(1.5% + 10px)"}>
            {results.type}
          </Text>
        </>
      ) : (
        <div style={{ width: "100%", height: "560px", maxWidth: "100%" }}>
          <img
            title="not found"
            allow="fullscreen"
            style={{ height:'100%' }}
            src="https://miro.medium.com/v2/resize:fit:1400/0*VMeYq1x7s1ObI0Sq.gif"
            width="100%"></img>
        </div>
      )}
      <div style={{ width: "97%", margin: "0 auto" }}>
        <CardCarousel
          data={similar}
          type={"movie"}
          title={"More Like This"}
          mt={"20px"}
        />
      </div>
    </Flex>
  );
}
