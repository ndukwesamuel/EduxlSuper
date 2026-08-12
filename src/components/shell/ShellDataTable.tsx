// ─── ShellDataTable.tsx ───────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  headers: string[];
  rows:    string[][];
}

export default function ShellDataTable({ headers, rows }: Props) {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={[styles.row, styles.headerRow]}>
        {headers.map((h, i) => (
          <Text key={i} style={[styles.cell, styles.header, i === 0 && styles.firstCell]}>{h}</Text>
        ))}
      </View>
      {/* Data rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={[styles.row, ri < rows.length - 1 && styles.borderBottom]}>
          {row.map((cell, ci) => (
            <Text key={ci} style={[styles.cell, ci === 0 && styles.firstCell, ci === 0 && styles.boldCell]}>{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  row:        { flexDirection: 'row' },
  headerRow:  { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cell:       { flex: 1, padding: 10, fontSize: 12, color: '#0F172A' },
  header:     { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  firstCell:  { flex: 1.2 },
  boldCell:   { fontWeight: '700' },
});
