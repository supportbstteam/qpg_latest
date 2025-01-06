import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'

import { CardBase } from '@rneui/base/dist/Card/Card'
import Header from '../../Component/Common_Component/Header'

const PrivacyPlicy = ({ navigation }) => {
  return (
    <>
      <Header
        bg={'blue'}
        title={'Privacy Policy'}
        leftIcon={'menu'}
        onLeftPress={() => navigation.toggleDrawer()}
      />

      <View style={styles.container}>
        <ScrollView>
          <CardBase>
            {/* <Text style={styles.main}>Privacy Policy </Text> */}
            <Text style={styles.secondPara}>
              We value your trust. In order to honor that trust, Best Way Learning adheres to ethical standards in gathering, using, and safeguarding any information you provide. Best Way Learning Pvt Ltd is a leading edutech company, incorporated in India, for imparting interactive learning. This privacy policy governs your use of the application Best Way Learning(Application) and the other associated applications and sites managed by Best Way Learning Pvt Ltd.
            </Text>

            <Text style={styles.title}>Automatically Collected Information </Text>
            <Text style={styles.secondPara}>In addition, the Application may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile devices unique device ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browsers you use, and information about the way you use the Application. As is true of most Mobile applications, we also collect other relevant information as per the permissions that you provide. We will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. We will retain Automatically Collected information for up to a period of time and thereafter may store it in aggregate.</Text>

            <Text style={styles.title}>Use of your Personal Information</Text>
            <Text style={styles.secondPara}>We use the collected to analyze trends, to conduct research, to administer the application, to learn about user's learning patterns and movements around the application and to gather demographic information and usage behavior about our user-base as a whole. Aggregated and individual, anonymous and non-anonymous data may periodically be transmitted to external services to help us improve the Application and our service. We will share your information with third parties only in the ways that are described below in this privacy statement. We may use the individual data and behavior patterns combined with personal information to provide you with personalized content, and better your learning objectives. Third parties provide certain services which we may use to analyze the data and information to personalize, drive insights and help us better your experience or reach out to you with more value added applications, products, information and services. However, these third party companies do not have any independent right to share this information.
              We may disclose ‘User provided and Automatically Collected’ Information:</Text>

              <Text style={styles.secondPara}><Text style={styles.title}>1. </Text>As required by law, such as to comply with a subpoena, or similar legal process; </Text>
              <Text style={styles.secondPara}><Text style={styles.title}>2. </Text> When we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request; </Text>
              <Text style={styles.secondPara}><Text style={styles.title}>3. </Text> With our trusted services providers who work on our behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement;  </Text>
              <Text style={styles.secondPara}><Text style={styles.title}>4. </Text> With third party service providers in order to personalize the for a better user experience and to perform behavioral analysis. If Best Way Learning Pvt Ltd is involved in a merger, acquisition, or sale of all or a portion of its assets, you will be notified via email and/or a prominent notice on our Web site or other channels of any change in ownership or uses of this information, as well as any choices you may have regarding this information.</Text>

              <Text style={styles.title}>Access to your Personal Information</Text>
            <Text style={styles.secondPara}>We will provide you with the means to ensure that your personal information is correct and current. If you have filled out a user profile, we will provide an obvious way for you to access and change your profile from our application.</Text>

            <Text style={styles.title}>Security</Text>
            <Text style={styles.secondPara}>We are concerned about safeguarding the confidentiality of your information. We provide physical, electronic, and procedural safeguards to protect information we process and maintain. For example, we limit access to this information to authorized employees only who need to know that information in order to operate, develop or improve our Application. Please be aware that, although we endeavor to provide reasonable security for information we process and maintain, no security system can prevent all potential security breaches.</Text>

            <Text style={styles.title}>Changes to this Statement</Text>
            <Text style={styles.secondPara}>As Best Way Learning evolves, our privacy policy will need to evolve as well to cover new situations. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</Text>

            <Text style={styles.title}>Your Consent</Text>
            <Text style={styles.secondPara}>By using the Application, you are consenting to our processing of your information as set forth in this Privacy Policy now and as amended by us. "Processing,” means using or touching information in any way, including, but not limited to, collecting, storing, deleting, using, combining and disclosing information, all of which activities will take place in India. If you reside outside India, your information will be transferred, processed and stored there under Indian privacy standards. Reach out to us on info@bestwaypublications.com, in case of any queries.</Text>
          </CardBase>
        </ScrollView>
      </View>
    </>
  )
}

export default PrivacyPlicy

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    marginBottom: 30
  },
  title: {
    marginTop: 30, fontSize: 16, fontWeight: "500", color: "#000", textAlign: "center"
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
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 8
  },

  secondPara: {
    textAlign: 'justify',
    lineHeight: 20,
    marginTop: 14,
    // marginLeft: 8,
    // marginRight: 8,
    fontSize: 16,
    color: "#333"
  },

  text: {
    fontWeight: '600',
    color: '#5272F2',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 4,
  }
})
