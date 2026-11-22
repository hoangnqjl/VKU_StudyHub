import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bot, Send, Sparkles, User } from 'lucide-react-native';
import { chatbotService, ChatHistoryItem } from '../services/chatbotService';

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const QUICK_PROMPTS = [
  'Cách học Pomodoro hiệu quả?',
  'Hướng dẫn tìm tài liệu trên VKU StudyHub',
  'Cách dùng Radar tìm bạn học cùng',
];

export default function ChatbotScreen() {
  const router = useRouter();
  const scrollRef = useRef<any>(null);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Xin chào! Mình là trợ lý AI của VKU StudyHub. Bạn cần hỗ trợ gì về học tập, tài liệu hay cách sử dụng ứng dụng hôm nay?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const handleSend = async (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text || loading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    const history: ChatHistoryItem[] = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-10)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const res = await chatbotService.sendMessage(text, history);
      const replyText = res?.data?.reply || 'Xin lỗi, mình chưa nhận được phản hồi.';
      setMessages((prev) => [
        ...prev,
        { id: `model-${Date.now()}`, role: 'model', text: replyText },
      ]);
    } catch (error: any) {
      const errMsg =
        error?.message ||
        'Không thể kết nối tới trợ lý AI. Vui lòng kiểm tra cấu hình GEMINI_API_KEY ở backend.';
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'model', text: `⚠️ ${errMsg}` },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Quay lại"
        >
          <ArrowLeft size={20} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <View style={styles.botBadge}>
            <Sparkles size={16} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Trợ lý VKU StudyHub</Text>
            <Text style={styles.headerSub}>Hỗ trợ học tập &amp; giải đáp 24/7</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <View
                key={msg.id}
                style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}
              >
                {!isUser && (
                  <View style={styles.avatarBot}>
                    <Bot size={16} color="#208AEF" />
                  </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
                  <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextBot]}>
                    {msg.text}
                  </Text>
                </View>
                {isUser && (
                  <View style={styles.avatarUser}>
                    <User size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            );
          })}

          {loading && (
            <View style={[styles.msgRow, styles.msgRowBot]}>
              <View style={styles.avatarBot}>
                <Bot size={16} color="#208AEF" />
              </View>
              <View style={[styles.bubble, styles.bubbleBot, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#208AEF" />
                <Text style={styles.loadingText}>Đang suy nghĩ...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickWrap}
            contentContainerStyle={styles.quickContent}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <Pressable
                key={prompt}
                style={styles.quickChip}
                onPress={() => handleSend(prompt)}
              >
                <Text style={styles.quickChipText}>{prompt}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi của bạn..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={4000}
            onSubmitEditing={() => handleSend()}
          />
          <Pressable
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Send size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowBot: {
    justifyContent: 'flex-start',
  },
  avatarBot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUser: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '76%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: '#208AEF',
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  msgTextBot: {
    color: '#0F172A',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  quickWrap: {
    maxHeight: 48,
    marginBottom: 8,
  },
  quickContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  quickChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
