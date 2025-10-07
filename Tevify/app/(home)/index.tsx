import React, { useState, useCallback } from "react";
import { ScrollView, Image, StyleSheet, View, TouchableOpacity, Dimensions, RefreshControl } from "react-native";
import { Video } from "expo-av";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import {VideoPlayer} from '@/components/VideoPlayer'

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * 0.75; // 3:4 aspect ratio for short videos

// Function to get initials from email or name
const getInitials = (email: string | undefined, firstName: string | undefined, lastName: string | undefined) => {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  if (email) {
    const username = email.split('@')[0];
    if (username.includes('.')) {
      const parts = username.split('.');
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return username.charAt(0).toUpperCase();
  }
  return "U";
};

// Function to generate a color based on the user's email
const generateColorFromEmail = (email: string | undefined) => {
  if (!email) return '#1DB954'; // Default Spotify green
  
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA73F', '#9B59B6', 
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#8E44AD'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

export default function Home() {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");

  // Create a videos array (can be in your Home component or a separate data file)
const videos = [
  {
    id: 1,
    videoUri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Miley Cyrus - Flowers",
    views: "12.4M views",
    uploadDate: "2 days ago"
  },
  {
    id: 2,
    videoUri: "https://videza.club/mp4api.php?id=3NlbDFtQ1lGSjhV&n=2NpemElMjAtJTIwaXNha2ElMjAlMjg2YW0lMjklMjBmdC4lMjBqYXp6d29yeCUyMCUyNiUyMHRodWt1dGhlbGElMjAlMjhvZmZpY2lhbCUyMG11c2ljJTIwdmlkZW8lMjkjZW5kIw&r=1",
    title: "The Weeknd - Blinding Lights",
    views: "8.7M views",
    uploadDate: "1 week ago"
  },
  {
    id: 3,
    videoUri: "https://r4---sn-5pguxahf-ca1s.googlevideo.com/videoplayback?expire=1757976518&ei=ZUPIaKjXO_ng6dsPsKXlkA0&ip=176.1.197.98&id=o-AJRztYf-2HqZi6cJrq7YQ7Z3mzwggUXlfoiZRNWWSa1T&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&rms=au%2Cau&bui=ATw7iSXmmlGCSdcupDTvu7Hqlj8FrYu0UVmJvG_iBetoyy_7Xg83qJU87hHBamiUFfm4ogEVctclcRhc&spc=hcYD5fB2x04bIvIsdVjVln8OtuOHgkzPaLVuMR-vvklcz6CbAxYGwFqO_jsKyGeLGxbGaeeqoodyNmcg0t8aIdJN5nM&vprv=1&svpuc=1&mime=video%2Fmp4&ns=WP2GGqMKwx3TxtILCRIFbMwQ&rqh=1&gir=yes&clen=20482007&ratebypass=yes&dur=241.859&lmt=1754091038767370&fexp=51331020%2C51552689%2C51565115%2C51565681%2C51580968&c=MWEB&sefc=1&txp=4538534&n=nUl2eNy59PunyA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgA8XJtHRJ0U6eduJDP9gH_9ViBhOsEz3NRciQcuKgjGMCIQCvslyQchPa8CuAgh6IQvwJYaTneTrVKN3mLCeWVm5u_A%3D%3D&pot=MnaFLGmlYw-I14USIdbwE5PKYk5NYlNcg6xHue3qIMjd97abH-ups0YRwgmBGGJJLoFj7BCAZ_R9pJQp9rdNS92tIvDojypl63uIul_NWRFeKNW3pI-ZO2_YlruwDKkpFeeoUHNfpUss1rpcPnwKpCDpSCTZL1ew&title=ciza%20-%20isaka%20(6am)%20ft.%20jazzworx%20&%20thukuthela%20(official%20music%20video)=&cms_redirect=yes&met=1757960175,&mh=pZ&mip=137.115.7.92&mm=31&mn=sn-5pguxahf-ca1s&ms=au&mt=1757959823&mv=m&mvi=4&pl=24&lsparams=met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRAIgXIyPq7YeF_3VI01JUgPIQrhu0pIoEjk25X-HpA8XQqECID6IL3xLWQ5NHaAE3T8x9WQelfQRslQ9-vtyNqpZ9OHl",
    title: "Dua Lipa - Don't Start Now",
    views: "15.2M views",
    uploadDate: "3 days ago"
  },
  {
    id: 4,
    videoUri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    title: "Harry Styles - As It Was",
    views: "20.1M views",
    uploadDate: "5 days ago"
  }
];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate refresh action
    setTimeout(() => {
      // Update greeting based on time of day
      const hour = new Date().getHours();
      let newGreeting = "Good morning";
      if (hour >= 12 && hour < 17) {
        newGreeting = "Good afternoon";
      } else if (hour >= 17) {
        newGreeting = "Good evening";
      }
      
      setGreeting(newGreeting);
      setRefreshing(false);
    }, 1500);
  }, []);

  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const initials = getInitials(userEmail, firstName, lastName);
  const avatarColor = generateColorFromEmail(userEmail);

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DB954"
            colors={["#1DB954"]}
            progressBackgroundColor="rgba(255,255,255,0.3)"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <ThemedText type="title" style={styles.greeting}>
              {greeting}
            </ThemedText>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="time-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton}>
              <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                <ThemedText type="defaultSemiBold" style={styles.avatarText}>
                  {initials}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {["Music", "Recently Played", "Audiobooks", "Made for You", "Podcasts & Shows"].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.tabButton}>
              <ThemedText type="defaultSemiBold" style={styles.tabText}>
                {item}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Access Cards */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Made for {firstName || "you"}
        </ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {[
            { title: "Daily Mix 1", subtitle: "Made for you", img: "https://tse3.mm.bing.net/th/id/OIP.BocwLu8cAVatfbPt3uhvAgHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3" },
            { title: "Discover Weekly", subtitle: "New music for you", img: "https://th.bing.com/th/id/R.07975dc703a2375960452fbbc5e7f2cc?rik=UmFG2Crx73KVCQ&pid=ImgRaw&r=0" },
            { title: "Release Radar", subtitle: "New releases", img: "https://th.bing.com/th/id/OIP.uk8nA7Vu5_UL5RFil4meUgHaGc?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.quickCard}>
              <Image source={{ uri: item.img }} style={styles.quickCardImage} />
              <View style={styles.quickCardContent}>
                <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.title}</ThemedText>
                <ThemedText type="default" style={styles.cardSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Album Grid */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recently played
        </ThemedText>
        <View style={styles.albumGrid}>
          {[
            { title: "Nymph", artist: "Dua Lipa", img: "https://source.unsplash.com/random/400x400?music" },
            { title: "Dance Generation", artist: "Calvin Harris", img: "https://source.unsplash.com/random/401x401?album" },
            { title: "POLLEN", artist: "Tyler, The Creator", img: "https://source.unsplash.com/random/402x402?playlist" },
            { title: "Crying in H Mart", artist: "Japanese Breakfast", img: "https://source.unsplash.com/random/403x403?cover" },
            { title: "Midnights", artist: "Taylor Swift", img: "https://source.unsplash.com/random/404x404?midnights" },
            { title: "Un Verano Sin Ti", artist: "Bad Bunny", img: "https://source.unsplash.com/random/405x405?verano" },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.albumCard}>
              <Image source={{ uri: item.img }} style={styles.albumImage} />
              <View style={styles.albumContent}>
                <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.albumTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText type="default" style={styles.artistName} numberOfLines={1}>
                  {item.artist}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Short Video Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Trending videos
        </ThemedText>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.horizontalScroll}
  pagingEnabled
  snapToAlignment="center"
  decelerationRate="fast"
>
  {videos.map((video) => (
    <View key={video.id} style={styles.videoItem}>
      <VideoPlayer
        videoUri={video.videoUri}
        title={video.title}
        views={video.views}
        uploadDate={video.uploadDate}
        autoPlay={false}
      />
    </View>
  ))}
</ScrollView>


        {/* More Videos */}
        <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>
          More videos
        </ThemedText>
        <View style={styles.videoGrid}>
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity key={item} style={styles.smallVideoCard}>
              <Image 
                source={{ uri: `https://source.unsplash.com/random/200x${300 + item}?video` }} 
                style={styles.smallVideoImage} 
              />
              <View style={styles.smallVideoContent}>
                <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.smallVideoTitle}>
                  Trending Music Video #{item}
                </ThemedText>
                <ThemedText type="default" style={styles.smallVideoStats}>
                  {Math.floor(Math.random() * 10) + 1}M views
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    top:8,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabsContent: {
    paddingRight: 16,
  },
  tabButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  tabText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 8,
  },
  horizontalScroll: {
    marginBottom: 24,
  },
  quickCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    overflow: "hidden",
  },
  quickCardImage: {
    width: "100%",
    height: 150,
  },
  quickCardContent: {
    padding: 12,
  },
  cardSubtitle: {
    opacity: 0.7,
    marginTop: 4,
    fontSize: 12,
  },
  albumGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  albumCard: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    overflow: "hidden",
  },
  albumImage: {
    width: "100%",
    height: 120,
  },
  albumContent: {
    padding: 12,
  },
  albumTitle: {
    fontSize: 14,
  },
  artistName: {
    opacity: 0.7,
    fontSize: 12,
    marginTop: 2,
  },
horizontalScroll: {
  marginTop: 20,
},

videoItem: {
  width: 300,
  height: VIDEO_HEIGHT,
  marginRight: 16,
  borderRadius: 12,
  overflow: "hidden",
},

  videoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  smallVideoCard: {
    width: "48%",
    marginBottom: 16,
  },
  smallVideoImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  smallVideoContent: {
    padding: 8,
  },
  smallVideoTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  smallVideoStats: {
    fontSize: 10,
    opacity: 0.7,
  },
});