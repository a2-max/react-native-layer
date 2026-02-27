import { useState } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  ScrollView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomSheet, ConfirmModal, Alert, useToast } from 'react-native-layer';
import type { DragDirection } from 'react-native-layer';

export default function App() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [scrollSheetVisible, setScrollSheetVisible] = useState(false);
  const [themedSheetVisible, setThemedSheetVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [guardVisible, setGuardVisible] = useState(false);
  const [centerAlertVisible, setCenterAlertVisible] = useState(false);
  const [bottomAlertVisible, setBottomAlertVisible] = useState(false);
  const [dragInfo, setDragInfo] = useState('');

  const { showToast } = useToast();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>react-native-layer</Text>
        <Text style={styles.subtitle}>Lightweight overlay primitives developed by Yatri Motorcycles</Text>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View style={styles.buttons}>
            {/* ── Sheets ── */}
            <Text style={styles.sectionLabel}>Bottom Sheets</Text>

            <Pressable
              style={styles.btn}
              onPress={() => setSheetVisible(true)}
            >
              <Text style={styles.btnText}>Bottom Sheet</Text>
            </Pressable>

            <Pressable
              style={styles.btn}
              onPress={() => setScrollSheetVisible(true)}
            >
              <Text style={styles.btnText}>Scrollable Sheet</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: '#7C3AED' }]}
              onPress={() => setThemedSheetVisible(true)}
            >
              <Text style={styles.btnText}>Themed Sheet (drag up!)</Text>
            </Pressable>

            {/* ── Confirm Modals ── */}
            <Text style={styles.sectionLabel}>Confirm Modals</Text>

            <Pressable
              style={styles.btn}
              onPress={() => setConfirmVisible(true)}
            >
              <Text style={styles.btnText}>Confirm Modal</Text>
            </Pressable>

            <Pressable
              style={styles.btn}
              onPress={() => setGuardVisible(true)}
            >
              <Text style={styles.btnText}>Guarded Confirm</Text>
            </Pressable>

            {/* ── Alerts ── */}
            <Text style={styles.sectionLabel}>Alerts</Text>

            <Pressable
              style={styles.btn}
              onPress={() => setCenterAlertVisible(true)}
            >
              <Text style={styles.btnText}>Center Alert</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: '#DC2626' }]}
              onPress={() => setBottomAlertVisible(true)}
            >
              <Text style={styles.btnText}>Bottom Alert</Text>
            </Pressable>

            <TextInput />
            {/* ── Toasts ── */}
            <Text style={styles.sectionLabel}>Toasts</Text>

            <Pressable
              style={styles.btn}
              onPress={() => {
                showToast({ message: 'This is a bottom toast', position: 'bottom' })
              }
              }
            >
              <Text style={styles.btnText}>Bottom Toast</Text>
            </Pressable>

            <Pressable
              style={styles.btn}
              onPress={() =>
                showToast({ message: 'This is a top toast', position: 'top' })
              }
            >
              <Text style={styles.btnText}>Top Toast</Text>
            </Pressable>

            <Pressable
              style={styles.btn}
              onPress={() =>
                showToast({ message: 'Centered!', position: 'center' })
              }
            >
              <Text style={styles.btnText}>Center Toast</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: '#16A34A' }]}
              onPress={() =>
                showToast({
                  message: 'Item saved successfully',
                  position: 'bottom',
                  backgroundColor: '#16A34A',
                  duration: 2000,
                })
              }
            >
              <Text style={styles.btnText}>Success Toast (2s)</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, { backgroundColor: '#D97706' }]}
              onPress={() =>
                showToast({
                  message:
                    'This is a very long toast message that should get truncated with an ellipsis because it exceeds the maximum number of allowed lines in the toast pill',
                  position: 'bottom',
                  backgroundColor: '#D97706',
                  duration: 4000,
                })
              }
            >
              <Text style={styles.btnText}>Long Toast (ellipsis)</Text>
            </Pressable>
          </View>
        </ScrollView>

        {dragInfo ? <Text style={styles.dragLabel}>{dragInfo}</Text> : null}

        {/* ── Basic Bottom Sheet (content-fitted) ── */}
        <BottomSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          onOpen={() => console.log('Sheet opened')}
        >
          <Text style={styles.sheetTitle}>Quick Actions</Text>
          {['Share', 'Copy Link', 'Edit', 'Report'].map((label) => (
            <Pressable
              key={label}
              style={styles.sheetRow}
              onPress={() => setSheetVisible(false)}
            >
              <Text style={styles.sheetRowText}>{label}</Text>
            </Pressable>
          ))}
        </BottomSheet>

        {/* ── Scrollable Bottom Sheet ── */}
        <BottomSheet
          visible={scrollSheetVisible}
          onClose={() => setScrollSheetVisible(false)}
        >
          <Text style={styles.sheetTitle}>Select an option</Text>
          <ScrollView style={styles.scrollContent}>
            {Array.from({ length: 20 }, (_, i) => (
              <Pressable
                key={i}
                style={styles.sheetRow}
                onPress={() => setScrollSheetVisible(false)}
              >
                <Text style={styles.sheetRowText}>Option {i + 1}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </BottomSheet>

        {/* ── Themed + Drag Events Sheet ── */}
        <BottomSheet
          visible={themedSheetVisible}
          onClose={() => {
            setThemedSheetVisible(false);
            setDragInfo('');
          }}
          onOpen={() => setDragInfo('Opened — drag handle up ↑')}
          onDrag={(direction: DragDirection, fraction: number) =>
            setDragInfo(`Dragging ${direction} · ${Math.round(fraction * 100)}%`)
          }
          onFullScreen={() => setDragInfo('Full screen!')}
          backgroundColor="#1E1B4B"
          handleColor="#A78BFA"
          backdropOpacity={0.7}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <Text style={[styles.sheetTitle, { color: '#E0E7FF' }]}>
            Themed Sheet
          </Text>
          <Text style={{ color: '#C7D2FE', marginBottom: 8 }}>
            Drag the handle up to go full screen, or down to dismiss.
          </Text>
          {['Inbox', 'Starred', 'Drafts', 'Sent', 'Trash'].map((label) => (
            <Pressable
              key={label}
              style={[styles.sheetRow, { borderBottomColor: '#312E81' }]}
              onPress={() => {
                setThemedSheetVisible(false);
                setDragInfo('');
              }}
            >
              <Text style={{ color: '#C7D2FE', fontSize: 15 }}>{label}</Text>
            </Pressable>
          ))}
        </BottomSheet>

        {/* ── Confirm Modal ── */}
        <ConfirmModal
          visible={confirmVisible}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          positiveText="Delete"
          positiveButtonColor="#DC2626"
          negativeText="Cancel"
          onCancel={() => setConfirmVisible(false)}
          onConfirm={() => {
            setConfirmVisible(false);
            showToast({ message: 'Item deleted', backgroundColor: '#DC2626' });
          }}
        />

        {/* ── Guarded Confirm ── */}
        <ConfirmModal
          visible={guardVisible}
          title="Delete Account"
          showInput
          inputLabel='Type "DELETE" to confirm'
          inputPlaceholder="DELETE"
          validationText="DELETE"
          positiveText="Delete Forever"
          positiveButtonColor="#DC2626"
          negativeText="Cancel"
          onCancel={() => setGuardVisible(false)}
          onConfirm={(value) => {
            console.log('Confirmed with:', value);
            setGuardVisible(false);
          }}
        />

        {/* ── Center Alert ── */}
        <Alert
          visible={centerAlertVisible}
          title="Update Available"
          message="A new version of the app is available. Please update to continue."
          buttonText="OK"
          type='success'
          position="center"
          onClose={() => setCenterAlertVisible(false)}
        />

        {/* ── Bottom Alert ── */}
        <Alert
          visible={bottomAlertVisible}
          title="Connection Lost"
          message="You are offline. Please check your internet connection and try again."
          buttonText="Dismiss"
          position="bottom"
          type='error'
          onClose={() => setBottomAlertVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  scroll: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 4,
  },
  buttons: {
    gap: 10,
    paddingBottom: 24,
  },
  btn: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  dragLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sheetRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  sheetRowText: {
    fontSize: 15,
    color: '#374151',
  },
  scrollContent: {
    maxHeight: 300,
  },
});