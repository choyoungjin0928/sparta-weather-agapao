import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clothes from "../clothes.json"
import { MaterialCommunityIcons } from "@expo/vector-icons";

import RecommendCard from "../components/RecommendCard"

//휴대폰 위치를 가져와도 되는지 물어보는 권한 요청 도구
import * as Location from "expo-location";
//외부 API 요청 도구
import axios from "axios"

const weatherData = {
    "data": {
        "Thunderstorm": {
            "iconName": "weather-lightning",
            "gradient": ["#373B44", "#4286f4"],
            "title": "천둥 번개가 치고 있어요!!",
            "subtitle": "집에 있긔..."
        },
        "Drizzle": {
            "iconName": "weather-hail",
            "gradient": ["#89F7FE", "#66A6FF"],
            "title": "이슬비가 내려요~",
            "subtitle": "분위기 있게 내리는 중 🏳️‍🌈"
        },
        "Rain": {
            "iconName": "weather-rainy",
            "gradient": ["#00C6FB", "#005BEA"],
            "title": "비가 내리고 있습니다 ☂️",
            "subtitle": "밖에 비온다 주륵주륵 :)"
        },
        "Snow": {
            "iconName": "weather-snowy",
            "gradient": ["#7DE2FC", "#B9B6E5"],
            "title": "눈이 내려와요",
            "subtitle": "눈싸움 ㄱ? ☃️ "
        },
        "Clear": {
            "iconName": "weather-sunny",
            "gradient": ["#FF7300", "#FEF253"],
            "title": "화창한 날이에요",
            "subtitle": "오늘 같은 날은 데이트...애인 있으면"
        },
        "Clouds": {
            "iconName": "weather-cloudy",
            "gradient": ["#D7D2CC", "#304352"],
            "title": "구름이 많습니다!",
            "subtitle": "우울해 하지말고 나가 놀기 ㅎ"
        },
        "Mist": {
            "iconName": "weather-hail",
            "gradient": ["#4DA0B0", "#D39D38"],
            "title": "(엷은) 안개가 낀",
            "subtitle": "뿌연 안개, 차조심! 🤚"
        },
        "Dust": {
            "iconName": "weather-hail",
            "gradient": ["#4DA0B0", "#D39D38"],
            "title": "먼지가 많습니다, 미세먼지?",
            "subtitle": "마스크 있죠?"
        },
        "Haze": {
            "iconName": "weather-hail",
            "gradient": ["#4DA0B0", "#D39D38"],
            "title": "안개까 낀것 처럼 흐린 날...",
            "subtitle": "흐리니 우울우울 하지말긔"
        }
    }
}

export default function MainPage() {

    const [state, setState] = useState({
        isLoading: true,
        //현재 날씨 명칭: Cloud, Sunny 와 같은...
        condition: 'Clear',
        //weatherData에서 꺼내올 iconName
        iconName: 'weather-sunny',
        //LinearGradient에서 사용할 색상 임의값 설정
        colors: ["#373B44", "#4286f4"],
        //현재 기온
        temp: 0,
        clothes: []
    })

    useEffect(() => {
        getLocation();
    }, [])

    const getLocation = async () => {
        try {
            await Location.requestPermissionsAsync();
            const locationData = await Location.getCurrentPositionAsync();
            console.log(locationData['coords']['latitude'])
            console.log(locationData['coords']['longitude'])
            const latitude = locationData['coords']['latitude'];
            const longitude = locationData['coords']['longitude'];
            //스파르타코딩 클럽에서 발급받은 키값
            const API_KEY = "cfc258c75e1da2149c33daffd07a911d";
            const result = await axios.get(
                `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );

            const temp = result['data']['main']['temp'];
            const condition = result['data']['weather'][0]['main']
            console.log(condition)
            console.log(temp)


            //화면에 사용할 아이콘 이름 가져오기
            //2주차 숙제때 MaterialCommunityIcons 를 썻었죠?
            const iconName = weatherData['data'][condition]["iconName"]

            //그라데이션 도구에 넣을 색상값 꺼내오기
            const colors = weatherData['data'][condition]["gradient"]
            console.log(iconName)
            console.log(colors)

            //clothes.json 데이터에서
            //현재 기온보다 5도 낮거나 5도 높은 범위의 알맞은 옷을 가져오기
            //pickClothes 리스트에 온도에 맞는 옷을 담습니다
            let pickClothes = []

            for (let i = 0; i < clothes['data'].length; i++) {
                let temp5up = temp + 5;
                let temp5down = temp - 5;

                if (clothes['data'][i]['temperature'] <= temp5up && clothes['data'][i]['temperature'] >= temp5down) {
                    pickClothes.push(clothes['data'][i])
                }
            }

            //위치 정보와 모든 날씨 데이터가 준비된다음, 
            //그리고 원하는 데이터까지 갖게 된다음 상태 값을 변경하기 위해 await를 붙였습니다
            //순서 고정!!
            //상태 값이 변경되면 화면이 다시 그려지겠죠?
            await setState({
                isLoading: true,
                //현재 날씨 명칭: Cloud, Sunny 와 같은...
                condition: condition,
                iconName: iconName,
                //현재 기온
                temp: temp,
                colors: colors,
                clothes: pickClothes
            })




        } catch (error) {
            console.log(error)
            //혹시나 위치를 못가져올 경우를 대비해서, 안내를 준비합니다
            Alert.alert("위치를 찾을 수가 없습니다.", "앱을 껏다 켜볼까요?");
        }
    }

    console.log(state)

    return (
        <ScrollView style={styles.weatherwrap}>
            <LinearGradient
                colors={state.colors}
                style={styles.container}
            >
                <StatusBar barStyle="dark-content" />
                <View style={styles.halfContainer}>
                    <MaterialCommunityIcons
                        size={96}
                        name={state.iconName}
                        color="white"
                    />
                    <Text style={styles.temp}>{state.temp}°</Text>
                </View>
            </LinearGradient>

            {state.clothes.map((c, i) => {
                return (<RecommendCard key={i} data={c} />)
            })}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    weatherwrap: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        margin: 10,
        borderRadius: 10
    },
    temp: {
        fontSize: 32,
        color: "white"
    },
    halfContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "300",
        marginBottom: 10,
        textAlign: "left"
    },
    subtitle: {
        fontWeight: "600",
        color: "white",
        fontSize: 20,
        textAlign: "left"
    },
    textContainer: {
        alignItems: "flex-start",
        paddingHorizontal: 40,
        justifyContent: "center",
        flex: 1
    },
    middleText: {
        margin: "auto",
        textAlign: "center",
        alignContent: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: '700',
    },
    banner: {
        position: "relative",
        width: '70%'
    }

});