import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  View,
  Text,
  StatusBar,
  Image,
 } from 'react-native';

 import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { GetJobApplication , SetUserSession, GetUserInfo } from '../Helpers/apihelper'

import Constants from '../../env'

import { Query, Mutation } from "react-apollo";
//import gql from graphql-tag for making queries to our graphql server.
import gql from "graphql-tag";


const CURRENT_USER_QUERY = gql`
  query { hello }
  `

console.log("SERVER_URL",Constants.SERVER_URL)

const SocialLogin = ({navigation}) => {    
  // const { loading, error, data, refetch } = useQuery(CURRENT_USER_QUERY);
  const [refresh,setRefresh] = useState(null);
  //console.log("data from graphql", data);

  const refetchingUser = () => refetch();

  const lookForUserInfo = () => {    
    GetUserInfo()
    .then(user => {
      console.log("user: ", user);
      setUserData(user)
    })
    .catch(err => { console.log("error when getting the user",err);
      refresh();
    });      
  }

  const handleOpenURL = ({ url }) => {
      if (url.indexOf("?sig") !== -1) {        
          console.log("redirect succesfull");          
          //SetUserSession(url);
         //refetchingUser()       
          // lookForUserInfo();
          console.log("refresh function", refresh);
          refresh();

      }
  };

  useEffect(() => {    
    Linking.addEventListener('url', handleOpenURL);    
  }, []);

  /*
  if (loading) {
    return <Text>Loading ... </Text>   
  }
*/

  return (
     <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Query query={CURRENT_USER_QUERY}>
          {/* The props.children of the Query will be a callback with a response, and error parameter. */}
          {(response, error, loading, refetch) => {
            setRefresh(refetch)
            if (error) {
              return <Text >{error}</Text>;
            }
            if (loading) {
              return <ActivityIndicator />;
            }
            //If the response is done, then will return the FlatList
            if (response) {
              console.log("response!!!! ", response)
              return <>
              {
                !response.data ? null :  <View style={styles.imageContainer}>
               <Text>Welcome { response.data.name.givenName }</Text>   
               <Image
                style={{width: 50, height:50}}
                source={{uri: response.data.photos[0].value}}             
                />            
                </View>
               }          
             <View style={styles.body}>
               <TouchableOpacity style={styles.socialBtn}
                 onPress={() => Linking.openURL(`${Constants.SERVER_URL}/auth/google`)}>
                 <Text style={styles.buttonText} >
                   {!response.data ? "Connect via Google" : "You are connected !"}</Text>
               </TouchableOpacity>
             </View>
             <View style={styles.body}>
               <TouchableOpacity style={styles.socialBtn}
                 onPress={() => navigation.navigate('JobApplication', { jobApplicationID: 35})}>
                 <Text style={styles.buttonText} >
                   {"Move to Edit"}</Text>
               </TouchableOpacity>
             </View>
             </>
            }
          }}
        </Query>       
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
  },
  socialBtn: {
    margin: 30,
    backgroundColor: '#1f5c9e',
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SocialLogin

