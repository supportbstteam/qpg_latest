import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import api from '../../API/api';
import { fetchToken } from '../../Helpers/fetchDetails';
import Header from '../../Component/Common_Component/Header';
import Textlabel from '../../Component/Common_Component/Textlabel';
import { CardBase } from '@rneui/base/dist/Card/Card';
import Toast from 'react-native-toast-message';

const ManageReport: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [SchoolUsers, SetSchoolUsers] = useState([]);
    const [isLoading, setSchoolLoading] = useState<boolean>(true);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    useEffect(() => {
        get_school_users();
    }, []);

    const get_school_users = async () => {
        const token = await fetchToken();
        if (token) {
            try {
                const response = await api.get_school_user(token);
                if (response.data.status === true) {
                    SetSchoolUsers(response.data.data);
                    setSchoolLoading(false);
                }
                console.log("school response", response.data);
            } catch (error) {
                console.error("school user error:", error);
            }
        }
    };

    const toggleReportsSection = (userId: number) => {
        setExpandedUserId(prev => (prev === userId ? null : userId));
    };

    const handleApprove = async (reportId: number) => {
      try {
        const formdata = {status: 1};
        const token = await fetchToken();
        if (token) {
                const response = await api.Approve_reject(reportId, token, formdata);
                Toast.show({
                    type: 'success',
                    text1: 'Status Approved',
                    visibilityTime: 2000,
                });
                get_school_users();
            }
        } catch (error) {
            console.error('Approval error:', error);
            Alert.alert('Error', 'Failed to approve report.');
        }
    };

    const handleReject = async (reportId: number) => {
        try {
            const formdata = { status: 0 };
            const token = await fetchToken();
            if (token) {
                const response = await api.Approve_reject(reportId, token, formdata);
                Toast.show({
                    type: 'success',
                    text1: 'Status Rejected',
                    visibilityTime: 2000,
                });
                get_school_users(); // Refresh the data
            }
        } catch (error) {
            console.error('Rejection error:', error);
            Alert.alert('Error', 'Failed to reject report.');
        }
    };

    const renderReportItem = ({ item }) => (
        <View style={styles.reportContainer}>
            <Text style={styles.reportTitle}>School Name: {item.school_name}</Text>
            <Text style={styles.reportDetail}>User Name: {item.user_name}</Text>
            <Text style={styles.reportDetail}>Remark: {item.remark}</Text>
            <Text style={styles.reportDetail}>Address: {item.address}</Text>
            <Text style={styles.reportDetail}>Pincode: {item.pincode}</Text>
            <Text style={styles.reportDetail}>Vehicle Type: {item.vehicle_type}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item.id)}
                >
                    <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.id)}
                >
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderItem = ({ item }) => (
        <CardBase containerStyle={styles.cardContainer}>
            <Textlabel title='Name:' value={item.name} />
            <Textlabel title='Email:' value={item.email} />
            <Textlabel title='Designation:' value={item.designation} />
            <Textlabel title='Contact No:' value={item.contact_no} />

            <TouchableOpacity onPress={() => toggleReportsSection(item.id)} style={styles.toggleButton}>
                <Text style={styles.toggleButtonText}>
                    {expandedUserId === item.id ? "Hide Reports" : "View Reports"}
                </Text>
            </TouchableOpacity>

            {expandedUserId === item.id && (
                <FlatList
                    data={item.reports}
                    renderItem={renderReportItem}
                    keyExtractor={reportItem => reportItem.id.toString()}
                />
            )}
        </CardBase>
    );

    return (
        <View style={styles.container}>
            <Header
                title={'Manage Report'}
                bg={'blue'}
                leftIcon={'menu'}
                onLeftPress={() => navigation.toggleDrawer()}
            />
            <View style={styles.listContainer}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={get_school_users} />
                    }
                    data={SchoolUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>
        </View>
    );
};

export default ManageReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    listContainer: {
        flex: 1,
        marginTop: 12,
    },
    cardContainer: {
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f8f9fa',
        elevation: 2,
    },
    toggleButton: {
        marginTop: 16,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    toggleButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    reportContainer: {
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
    },
    reportTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#495057',
    },
    reportDetail: {
        fontSize: 14,
        marginTop: 8,
        color: '#6c757d',
        marginVertical: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    approveButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
        marginRight: 8,
        alignItems: 'center',
    },
    rejectButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    flatListContent: {
        paddingBottom: 20,
    },
});
