// components/VideoPlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Animated } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * 0.75;

interface VideoPlayerProps {
  videoUri: string;
  title: string;
  views: string;
  uploadDate: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUri,
  title,
  views,
  uploadDate,
  autoPlay = false,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  
  const controlsOpacity = useRef(new Animated.Value(0)).current;
  const bufferingTimeout = useRef<NodeJS.Timeout>();

  // Pre-load video content
  useEffect(() => {
    const preloadVideo = async () => {
      try {
        await Video.prefetch(videoUri);
        setHasLoaded(true);
      } catch (error) {
        console.log("Video preload failed:", error);
      }
    };

    preloadVideo();
  }, [videoUri]);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const showControlsWithAnimation = () => {
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Auto hide controls after 3 seconds
    setTimeout(() => hideControls(), 3000);
  };

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  };

  const toggleControls = () => {
    if (showControls) {
      hideControls();
    } else {
      showControlsWithAnimation();
    }
  };

  const seekForward = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        await videoRef.current.setPositionAsync(
          Math.min(status.positionMillis + 10000, status.durationMillis || 0)
        );
      }
    }
  };

  const seekBackward = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        await videoRef.current.setPositionAsync(
          Math.max(status.positionMillis - 10000, 0)
        );
      }
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      
      // Handle buffering with debounce
      if (status.isBuffering) {
        clearTimeout(bufferingTimeout.current);
        bufferingTimeout.current = setTimeout(() => {
          setBuffering(true);
        }, 1000); // Only show buffering if it lasts more than 1 second
      } else {
        clearTimeout(bufferingTimeout.current);
        setBuffering(false);
      }
      
      if (status.durationMillis) {
        setDuration(status.durationMillis);
        setProgress(status.positionMillis / status.durationMillis);
      }
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={toggleControls}
      activeOpacity={1}
    >
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="cover"
        useNativeControls={false}
        shouldPlay={autoPlay && hasLoaded}
        isLooping={true}
        isMuted={isMuted}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onLoad={() => {
          setIsLoading(false);
          setHasLoaded(true);
        }}
        onLoadStart={() => {
          if (!hasLoaded) setIsLoading(true);
        }}
      />
      
      {/* Initial Loading Indicator */}
      {isLoading && !hasLoaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1DB954" />
          <ThemedText style={styles.loadingText}>Loading video...</ThemedText>
        </View>
      )}

      {/* Buffering Indicator (only shows for extended buffering) */}
      {buffering && (
        <View style={styles.bufferingOverlay}>
          <ActivityIndicator size="small" color="#1DB954" />
        </View>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && (
        <TouchableOpacity 
          style={styles.playOverlay}
          onPress={togglePlayPause}
        >
          <View style={styles.playButtonCircle}>
            <Ionicons name="play" size={28} color="white" />
          </View>
        </TouchableOpacity>
      )}

      {/* Controls Overlay */}
      <Animated.View 
        style={[
          styles.controlsOverlay,
          { opacity: controlsOpacity }
        ]}
        pointerEvents={showControls ? "auto" : "none"}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.timeContainer}>
            <ThemedText style={styles.timeText}>
              {formatTime(progress * duration)}
            </ThemedText>
            <ThemedText style={styles.timeText}>
              {formatTime(duration)}
            </ThemedText>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={seekBackward} style={styles.controlButton}>
            <Ionicons name="play-back" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={seekForward} style={styles.controlButton}>
            <Ionicons name="play-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.videoInfo}>
            <ThemedText type="defaultSemiBold" style={styles.videoTitle}>
              {title}
            </ThemedText>
            <ThemedText type="default" style={styles.videoStats}>
              {views} • {uploadDate}
            </ThemedText>
          </View>
          
          <TouchableOpacity 
            onPress={toggleMute}
            style={styles.muteButton}
          >
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-medium"} 
              size={18} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Floating mute button */}
      {isPlaying && !showControls && (
        <TouchableOpacity 
          style={styles.floatingMuteButton}
          onPress={toggleMute}
        >
          <Ionicons 
            name={isMuted ? "volume-mute" : "volume-medium"} 
            size={14} 
            color="white" 
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: 'relative',
  },
  video: {
    width: "100%",
    height: VIDEO_HEIGHT,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 14,
    opacity: 0.8,
  },
  bufferingOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressBar: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    paddingVertical: 16,
  },
  controlButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  playPauseButton: {
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
  },
  infoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    marginBottom: 2,
    color: 'white',
  },
  videoStats: {
    fontSize: 11,
    opacity: 0.8,
    color: 'white',
  },
  muteButton: {
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    marginLeft: 12,
  },
  floatingMuteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});