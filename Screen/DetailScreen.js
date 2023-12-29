import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const DetailScreen = ({ route }) => {
  const { kf_personalloan } = route.params;
  const navigation = useNavigation();

  const [creatorDetails, setCreatorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        const creatorId = kf_personalloan._createdby_value;
        const response = await axios.get(
          `https://org0f7e6203.crm5.dynamics.com/api/data/v9.0/systemusers(${creatorId})`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Replace with your access token
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setCreatorDetails(response.data);
        } else {
          console.log("Failed to fetch creator details. Response status:", response.status);
        }
      } catch (error) {
        console.error("Error during creator details fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorDetails();
  }, [kf_personalloan._createdby_value]);

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.detailText}>Name: {kf_personalloan.kf_firstname}</Text>
          <Text style={styles.detailText}>Mobile: {kf_personalloan.kf_mobile}</Text>
          <Text style={styles.detailText}>Last Name: {kf_personalloan.kf_lastname}</Text>
          <Text style={styles.detailText}>Name: {kf_personalloan.kf_name}</Text>
          <Text style={styles.detailText}>Email: {kf_personalloan.kf_email}</Text>
          <Text style={styles.detailText}>Gender: {kf_personalloan.kf_gender}</Text>
          <Text style={styles.detailText}>City: {kf_personalloan.kf_city}</Text>
          <Text style={styles.detailText}>State: {kf_personalloan.kf_state}</Text>
          <Text style={styles.detailText}>Pincode: {kf_personalloan.kf_pincode}</Text>

          {creatorDetails && (
            <View>
              <Text style={styles.creatorText}>
                Created by: {creatorDetails.fullname || "Unknown"}
              </Text>
            </View>
          )}

          {/ Back button /}
          <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Personal Loan</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailText: {
    fontSize: 18,
    marginBottom: 8,
  },
  creatorText: {
    fontSize: 16,
    marginTop: 10,
    color: "gray",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default DetailScreen;