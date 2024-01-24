import { View, Text, StyleSheet,ScrollView } from 'react-native'
import React from 'react'

import { CardBase } from '@rneui/base/dist/Card/Card'
import Header from '../../Component/Common_Component/Header'


const Help = ({ navigation }) => {
    return (
        <>
            <Header
                bg={'blue'}
                title={'Help'}
                leftIcon={'menu-unfold'}
                onLeftPress={() => navigation.toggleDrawer()}
            />
            <View style={styles.container}>
                <ScrollView>

                    <CardBase>
                        <Text style={styles.main}>Help For Users </Text>
                        <Text style={styles.secondPara}>
                        Welcome to Best Way Learning, our cutting-edge publications app tailored for educators and students. Within this app, students are granted exclusive access upon initial login using a username and password. Once logged in, a vibrant digital content page greets you, brimming with possibilities.
                        </Text>
                        <Text style={styles.secondPara}>
                            Upon landing on the digital content page, there are lots of options await, neatly organized from class 1 to class 8. By simply selecting your desired class, you seamlessly navigate to the subjects page, Where lots of different subjects are waiting for you to explore.
                        </Text>
                        <Text style={styles.secondPara}>
                            Here, you can pick what you like. Just choose a subject you find interesting and press a button. That takes you to a special place full of fun educational videos called 'Animation Option'.
                        </Text>
                        <Text style={styles.secondPara}>
                            Get ready to have fun while you watch amazing educational videos that make learning awesome! Whether it's science, mathematics, languages, or any other subject, these videos are designed to captivate, educate, and inspire your academic journey.
                        </Text>

                        <Text style={styles.secondPara}>
                            Explore, learn, and dive into QPG's awesome educational videos designed just for you and how you like to learn.
                        </Text>
                        {/* <View>
                        <Text style={styles.text}> Best Regards </Text>
                        <Text style={{ fontSize: 18, marginLeft: 4, }}> Sandeep Garg </Text>
                    </View> */}
                    </CardBase>



                    <CardBase >
                        <Text style={styles.main1}>Students' Essential Guide </Text>

                        <Text style={{ fontSize: 20,color:"#000" }}>Step-by-Step Guide on How to Use the QPG Publications App</Text>


                        <Text style={styles.secondPara}><Text style={styles.title}>Create an Account: </Text>Begin by signing up for the QPG app using your provided credentials, such as a username and password. This account grants exclusive access to the app's educational content.</Text>


                        <Text style={styles.secondPara}><Text style={styles.title}>Sign In: </Text>Once your account is created, sign in using your username and password to gain entry into the app.</Text>

                        <Text style={styles.secondPara}><Text style={styles.title}>Dashboard (Digital Content): </Text>Upon logging in, you'll land on a dynamic digital content page bursting with educational possibilities. This is your hub for exploring various subjects and resources.</Text>


                        <Text style={styles.secondPara}><Text style={styles.title}>Classes: </Text>Navigate through the app's organized structure categorized by class levels, ranging from class 1 to class 8. Simply select your current grade level to proceed.</Text>


                        <Text style={styles.secondPara}><Text style={styles.title}>Subjects:  </Text>Within your selected class, explore a range of subjects available for study. Choose the subjects that interest you or that align with your academic needs.</Text>


                        <Text style={styles.secondPara}><Text style={styles.title}>Digital Content(Animations):</Text>Dive into 'Animations' Access a special section dedicated to fun and informative educational videos named 'Animation Option.' These videos cover diverse subjects and are designed to make learning engaging and enjoyable.</Text>
                    </CardBase>

                    <CardBase >
                        <Text style={styles.main1}>Teachers' Essential Guide</Text>

                        <Text  style={{ fontSize: 20,color:"#000" }}>Step-by-Step Guide on How to Use the Best Way Learning App</Text>
                        <Text style={styles.secondPara}><Text style={styles.title}>Create an Account: </Text>Begin by registering an account on the QPG app. Teachers can sign up using their credentials to access the platform.</Text>


                        <Text style={styles.secondPara}><Text style={styles.title}>Sign In(After Admin Approval):</Text>After creating an account, use your username and password to sign in securely.</Text>

                        <Text style={styles.secondPara}><Text style={styles.title}>Dashboard (Digital Content):</Text>Upon logging in, the dashboard welcomes you to a vibrant digital content page tailored for educators. This page is the gateway to an array of educational resources.</Text>

                        <Text style={styles.secondPara}><Text style={styles.title}>Classes:</Text>Explore content neatly organized according to different grade levels (from class 1 to class 8). Teachers can select the relevant class they teach or wish to access.</Text>

                        <Text style={styles.secondPara}><Text style={styles.title}>Subjects: </Text>Once a class is chosen, navigate through various subjects available for that specific class. Teachers can delve into subjects they teach or want to explore further.</Text>

                        <Text style={styles.secondPara}><Text style={styles.title}>Digital Content(Animations,E-Books,Answer Key): </Text>Explore additional resources and functionalities available for educators beyond the 'Animations' section. Access teaching aids, supplementary materials, or other educational content as per your needs.</Text>

                        <Text style={{ fontSize: 20, color:"#000",marginTop: 10 }}>This guide aims to streamline the process for Users to navigate the QPG app, offering an organized approach to accessing and utilizing its features effectively.</Text>


                    </CardBase>

                </ScrollView>
            </View>

        </>
    )
}

export default Help

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        marginBottom: 30
    },
    title: {
        marginTop: 30, fontSize: 17, fontWeight: "500",color:"#000"
    },

    main: {
        fontSize: 30,
        color: '#5272F2',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 12
    },

    main1: {
        fontSize: 20,
        color: '#5272F2',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 12,

    },

    para: {
        fontSize: 15,
        textAlign: 'left',
        lineHeight: 20,
        // fontWeight: '500',
        marginLeft: 8,
        marginRight: 8,
        color:"#333"
    },

    secondPara: {
        textAlign: 'justify',
        lineHeight: 20,
        marginTop: 14,
        // marginLeft: 8,
        // marginRight: 8,
        fontSize: 16,
        color:"#333"
    },

    text: {
        fontWeight: '600',
        color: '#5272F2',
        fontSize: 18,
        marginTop: 10,
        marginLeft: 4,
    }
})