import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  IndentIncrease,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Table,
  Code,
  Eye,
  Check,
  X,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';
import { pickAndUploadImage } from '@/lib/storage';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const COLOR_PALETTE = [
  { label: 'Défaut', color: '#0f172a', darkColor: '#fef9e7' },
  { label: 'Or Ambré', color: '#d97706', darkColor: '#facc15' },
  { label: 'Émeraude', color: '#16a34a', darkColor: '#4ade80' },
  { label: 'Ciel', color: '#0284c7', darkColor: '#38bdf8' },
  { label: 'Rubis', color: '#dc2626', darkColor: '#ef4444' },
  { label: 'Violet', color: '#7c3aed', darkColor: '#c084fc' },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Rédigez ici une description vendeuse et percutante...',
}: RichTextEditorProps) {
  const { colors, isDark } = useAppTheme();
  const inputRef = useRef<TextInput>(null);

  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  
  // Modals & Popovers
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Remplacement ou insertion de texte à la position du curseur
  const insertText = (before: string, after: string = '', defaultContent: string = '') => {
    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);

    const hasSelection = start !== end;
    const selected = hasSelection ? value.substring(start, end) : defaultContent;

    const replacement = `${before}${selected}${after}`;
    const nextValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(nextValue);

    // Repositionne la sélection
    const newCursor = start + replacement.length;
    setSelection({ start: newCursor, end: newCursor });
  };

  // Gestion des Titres
  const handleHeading = (level: 1 | 2 | 0) => {
    if (level === 1) {
      insertText('\n# ', '\n', 'Titre Principal');
    } else if (level === 2) {
      insertText('\n## ', '\n', 'Sous-Titre');
    } else {
      insertText('\n', '\n', 'Paragraphe normal');
    }
  };

  // Alignements
  const handleAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    insertText(`\n<div align="${align}">\n`, '\n</div>\n', 'Texte avec alignement');
  };

  // Couleurs
  const handleSelectColor = (selectedColor: string) => {
    insertText(`<span style="color:${selectedColor}">`, '</span>', 'Texte coloré');
    setShowColorPicker(false);
  };

  // Insertion de Lien
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const label = linkText.trim() || 'Lien';
    insertText(`[${label}](`, `)`, linkUrl.trim());
    setLinkText('');
    setLinkUrl('');
    setShowLinkModal(false);
  };

  // Upload ou Insertion d'Image Inline
  const handlePickInlineImage = async () => {
    setUploadingInlineImage(true);
    try {
      const res = await pickAndUploadImage();
      if (res.success && res.url) {
        setImageUrl(res.url);
      } else if (res.error) {
        Alert.alert('Erreur', res.error);
      }
    } finally {
      setUploadingInlineImage(false);
    }
  };

  const handleConfirmImage = () => {
    if (!imageUrl.trim()) return;
    const alt = imageAlt.trim() || 'Illustration';
    insertText(`\n![${alt}](`, ')\n', imageUrl.trim());
    setImageAlt('');
    setImageUrl('');
    setShowImageModal(false);
  };

  // Insertion de Vidéo
  const handleConfirmVideo = () => {
    if (!videoUrl.trim()) return;
    const title = videoTitle.trim() || 'Vidéo de démonstration';
    insertText(`\n[▶️ ${title}](`, ')\n', videoUrl.trim());
    setVideoTitle('');
    setVideoUrl('');
    setShowVideoModal(false);
  };

  // Insertion de Tableau
  const handleInsertTable = () => {
    const tableTemplate = `\n| Caractéristique | Spécification |\n| --- | --- |\n| Modèle / Réf | ZS-100 |\n| Qualité | Premium Certifié |\n`;
    insertText(tableTemplate);
  };

  // Rendu de prévisualisation WYSIWYG épuré
  const renderPreview = () => {
    if (!value.trim()) {
      return (
        <Text style={[styles.emptyPreview, { color: colors.TEXT_FAINT }]}>
          Aucun texte à prévisualiser. Utilisez l'éditeur pour rédiger votre description.
        </Text>
      );
    }

    // Découpage par lignes
    const lines = value.split('\n');

    return (
      <View style={styles.previewContainer}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Ligne vide
          if (!trimmed) {
            return <View key={idx} style={{ height: 10 }} />;
          }

          // Titre 1 (# ...)
          if (trimmed.startsWith('# ')) {
            return (
              <Text key={idx} style={[styles.previewH1, { color: colors.TEXT_PRIMARY }]}>
                {trimmed.replace('# ', '')}
              </Text>
            );
          }

          // Titre 2 (## ...)
          if (trimmed.startsWith('## ')) {
            return (
              <Text key={idx} style={[styles.previewH2, { color: colors.TEXT_PRIMARY }]}>
                {trimmed.replace('## ', '')}
              </Text>
            );
          }

          // Image inline (![alt](url))
          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const [, alt, url] = imgMatch;
            return (
              <View key={idx} style={[styles.previewImgBox, { borderColor: colors.BORDER, backgroundColor: colors.BG_INPUT }]}>
                <Image source={{ uri: url }} style={styles.previewInlineImg} resizeMode="cover" />
                {alt ? <Text style={[styles.previewImgCaption, { color: colors.TEXT_MUTED }]}>{alt}</Text> : null}
              </View>
            );
          }

          // Vidéo inline ([▶️ ...](url))
          const videoMatch = trimmed.match(/^\[▶️\s*(.*?)\]\((.*?)\)$/);
          if (videoMatch) {
            const [, title, url] = videoMatch;
            return (
              <View key={idx} style={[styles.previewVideoBox, { borderColor: colors.ACCENT, backgroundColor: colors.ACCENT_BG }]}>
                <Text style={[styles.previewVideoTitle, { color: colors.ACCENT }]}>▶️ {title}</Text>
                <Text style={[styles.previewVideoUrl, { color: colors.TEXT_MUTED }]} numberOfLines={1}>{url}</Text>
              </View>
            );
          }

          // Liste à puces (• ou -)
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
            return (
              <View key={idx} style={styles.previewListRow}>
                <Text style={[styles.previewBullet, { color: colors.ACCENT }]}>•</Text>
                <Text style={[styles.previewListText, { color: colors.TEXT_PRIMARY }]}>
                  {trimmed.replace(/^[•-]\s*/, '')}
                </Text>
              </View>
            );
          }

          // Liste numérotée (1. ...)
          const numMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
          if (numMatch) {
            return (
              <View key={idx} style={styles.previewListRow}>
                <Text style={[styles.previewNum, { color: colors.ACCENT }]}>{numMatch[1]}.</Text>
                <Text style={[styles.previewListText, { color: colors.TEXT_PRIMARY }]}>
                  {numMatch[2]}
                </Text>
              </View>
            );
          }

          // Ligne de tableau markdown
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (trimmed.includes('---')) return null; // Séparateur d'en-tête
            const cells = trimmed.split('|').filter(Boolean).map((c) => c.trim());
            return (
              <View key={idx} style={[styles.previewTableRow, { borderColor: colors.BORDER, backgroundColor: colors.BG_INPUT }]}>
                {cells.map((c, cIdx) => (
                  <Text key={cIdx} style={[styles.previewTableCell, { color: colors.TEXT_PRIMARY }]}>
                    {c}
                  </Text>
                ))}
              </View>
            );
          }

          // Paragraphe standard
          return (
            <Text key={idx} style={[styles.previewP, { color: colors.TEXT_PRIMARY }]}>
              {line}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.editorCard, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
      {/* EN-TÊTE DU BLOC ÉDITEUR & BASCULE DE MODE */}
      <View style={[styles.headerBar, { borderBottomColor: colors.BORDER }]}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.editorTitle, { color: colors.TEXT_PRIMARY }]}>Description Complète (WYSIWYG)</Text>
          <View style={[styles.badgePill, { backgroundColor: colors.ACCENT_BG }]}>
            <Text style={[styles.badgeText, { color: colors.ACCENT }]}>Rich-Text</Text>
          </View>
        </View>

        {/* BASCULE ÉDITION / APERÇU DIRECT */}
        <View style={[styles.modeToggle, { backgroundColor: colors.BG_INPUT }]}>
          <TouchableOpacity
            onPress={() => setMode('edit')}
            style={[styles.toggleBtn, mode === 'edit' && [styles.toggleActive, { backgroundColor: colors.BG_CARD }]]}
          >
            <Code size={13} color={mode === 'edit' ? colors.ACCENT : colors.TEXT_MUTED} />
            <Text
              style={[
                styles.toggleText,
                { color: mode === 'edit' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                mode === 'edit' && styles.toggleTextActive,
              ]}
            >
              Éditeur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('preview')}
            style={[styles.toggleBtn, mode === 'preview' && [styles.toggleActive, { backgroundColor: colors.BG_CARD }]]}
          >
            <Eye size={13} color={mode === 'preview' ? colors.ACCENT : colors.TEXT_MUTED} />
            <Text
              style={[
                styles.toggleText,
                { color: mode === 'preview' ? colors.TEXT_PRIMARY : colors.TEXT_MUTED },
                mode === 'preview' && styles.toggleTextActive,
              ]}
            >
              Aperçu
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BARRE D'OUTILS WYSIWYG HORIZONTALE COMPLÈTE */}
      {mode === 'edit' && (
        <View style={[styles.toolbarContainer, { borderBottomColor: colors.BORDER, backgroundColor: colors.BG_INPUT }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScroll}>
            {/* GROUPE 1 : TITRES & TYPOGRAPHIE */}
            <TouchableOpacity onPress={() => handleHeading(1)} style={styles.toolBtn}>
              <Heading1 size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleHeading(2)} style={styles.toolBtn}>
              <Heading2 size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleHeading(0)} style={styles.toolBtn}>
              <Type size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>

            <View style={[styles.toolDivider, { backgroundColor: colors.BORDER }]} />

            {/* GROUPE 2 : MISES EN FORME DU TEXTE */}
            <TouchableOpacity onPress={() => insertText('**', '**', 'Texte en gras')} style={styles.toolBtn}>
              <Bold size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => insertText('*', '*', 'Texte en italique')} style={styles.toolBtn}>
              <Italic size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => insertText('<u>', '</u>', 'Texte souligné')} style={styles.toolBtn}>
              <Underline size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>

            <View style={[styles.toolDivider, { backgroundColor: colors.BORDER }]} />

            {/* GROUPE 3 : COULEUR & PERSONNALISATION */}
            <TouchableOpacity
              onPress={() => setShowColorPicker(!showColorPicker)}
              style={[styles.toolBtn, showColorPicker && { backgroundColor: colors.ACCENT_BG }]}
            >
              <Palette size={17} color={showColorPicker ? colors.ACCENT : colors.TEXT_PRIMARY} />
            </TouchableOpacity>

            {/* GROUPE 4 : ALIGNEMENTS */}
            <TouchableOpacity onPress={() => handleAlign('left')} style={styles.toolBtn}>
              <AlignLeft size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAlign('center')} style={styles.toolBtn}>
              <AlignCenter size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAlign('right')} style={styles.toolBtn}>
              <AlignRight size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAlign('justify')} style={styles.toolBtn}>
              <AlignJustify size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>

            <View style={[styles.toolDivider, { backgroundColor: colors.BORDER }]} />

            {/* GROUPE 5 : LISTES & STRUCTURE */}
            <TouchableOpacity onPress={() => insertText('\n• ', '', 'Point clé')} style={styles.toolBtn}>
              <List size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => insertText('\n1. ', '', 'Étape importante')} style={styles.toolBtn}>
              <ListOrdered size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => insertText('\n  - ', '', 'Détail indenté')} style={styles.toolBtn}>
              <IndentIncrease size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>

            <View style={[styles.toolDivider, { backgroundColor: colors.BORDER }]} />

            {/* GROUPE 6 : MÉDIAS & INTÉGRATIONS */}
            <TouchableOpacity onPress={() => setShowLinkModal(true)} style={styles.toolBtn}>
              <LinkIcon size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowImageModal(true)} style={styles.toolBtn}>
              <ImageIcon size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowVideoModal(true)} style={styles.toolBtn}>
              <Video size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInsertTable} style={styles.toolBtn}>
              <Table size={17} color={colors.TEXT_PRIMARY} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* SÉLECTEUR DE COULEURS INLINE */}
      {showColorPicker && (
        <View style={[styles.colorPickerRow, { backgroundColor: colors.BG_INPUT, borderBottomColor: colors.BORDER }]}>
          <Text style={[styles.colorPickerLabel, { color: colors.TEXT_MUTED }]}>Choisir une couleur :</Text>
          {COLOR_PALETTE.map((c) => {
            const activeHex = isDark ? c.darkColor : c.color;
            return (
              <TouchableOpacity
                key={c.label}
                onPress={() => handleSelectColor(activeHex)}
                style={[styles.colorDot, { backgroundColor: activeHex }]}
              />
            );
          })}
        </View>
      )}

      {/* ZONE DE SAISIE DE TEXTE (CONFINÉE SANS SUPERPOSITION) */}
      {mode === 'edit' ? (
        <TextInput
          ref={inputRef}
          style={[
            styles.textAreaInput,
            {
              color: colors.TEXT_PRIMARY,
              backgroundColor: colors.BG_CARD,
            },
          ]}
          value={value}
          onChangeText={onChange}
          onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
          placeholder={placeholder}
          placeholderTextColor={colors.TEXT_FAINT}
          multiline
          scrollEnabled={false} // Délègue le scroll au ScrollView parent pour éviter le blocage tactile
          textAlignVertical="top"
        />
      ) : (
        <View style={styles.previewScrollArea}>{renderPreview()}</View>
      )}

      {/* PIED DE L'ÉDITEUR AVEC STATISTIQUES */}
      <View style={[styles.footerBar, { borderTopColor: colors.BORDER }]}>
        <Text style={[styles.footerStat, { color: colors.TEXT_MUTED }]}>
          {value.length} caractère(s) • {value.trim() ? value.trim().split(/\s+/).length : 0} mot(s)
        </Text>
        <Text style={[styles.footerHint, { color: colors.TEXT_FAINT }]}>Markdown + HTML</Text>
      </View>

      {/* MODAL 1 : INSERTION DE LIEN */}
      <Modal visible={showLinkModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>Insérer un Lien</Text>
              <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                <X size={20} color={colors.TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Texte du lien (ex: Découvrir nos offres)"
              placeholderTextColor={colors.TEXT_FAINT}
              value={linkText}
              onChangeText={setLinkText}
              style={[styles.modalInput, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />
            <TextInput
              placeholder="URL cible (https://...)"
              placeholderTextColor={colors.TEXT_FAINT}
              value={linkUrl}
              onChangeText={setLinkUrl}
              autoCapitalize="none"
              style={[styles.modalInput, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowLinkModal(false)} style={styles.modalCancelBtn}>
                <Text style={{ color: colors.TEXT_MUTED, fontWeight: '700' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleInsertLink} style={[styles.modalConfirmBtn, { backgroundColor: colors.ACCENT }]}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.modalConfirmText}>Insérer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2 : INSERTION D'IMAGE INLINE */}
      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>Insérer une Image Inline</Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
                <X size={20} color={colors.TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handlePickInlineImage}
              disabled={uploadingInlineImage}
              style={[styles.modalPickBtn, { backgroundColor: colors.BG_INPUT, borderColor: colors.ACCENT }]}
            >
              {uploadingInlineImage ? (
                <ActivityIndicator size="small" color={colors.ACCENT} />
              ) : (
                <>
                  <ImageIcon size={18} color={colors.ACCENT} />
                  <Text style={[styles.modalPickText, { color: colors.ACCENT }]}>Choisir depuis la galerie</Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Ou coller une URL d'image (https://...)"
              placeholderTextColor={colors.TEXT_FAINT}
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
              style={[styles.modalInput, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />

            <TextInput
              placeholder="Légende / Texte alternatif (Alt)"
              placeholderTextColor={colors.TEXT_FAINT}
              value={imageAlt}
              onChangeText={setImageAlt}
              style={[styles.modalInput, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowImageModal(false)} style={styles.modalCancelBtn}>
                <Text style={{ color: colors.TEXT_MUTED, fontWeight: '700' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmImage} style={[styles.modalConfirmBtn, { backgroundColor: colors.ACCENT }]}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.modalConfirmText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3 : INSERTION DE VIDÉO */}
      <Modal visible={showVideoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.BG_CARD, borderColor: colors.BORDER }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>Insérer une Vidéo</Text>
              <TouchableOpacity onPress={() => setShowVideoModal(false)}>
                <X size={20} color={colors.TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Titre de la vidéo (ex: Démo produit)"
              placeholderTextColor={colors.TEXT_FAINT}
              value={videoTitle}
              onChangeText={setVideoTitle}
              style={[styles.modalInput, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />
            <TextInput
              placeholder="Lien vidéo (YouTube / Vimeo / MP4)"
              placeholderTextColor={colors.TEXT_FAINT}
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
              style={[styles.modalInput, { backgroundColor: colors.BG_INPUT, borderColor: colors.BORDER, color: colors.TEXT_PRIMARY }]}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowVideoModal(false)} style={styles.modalCancelBtn}>
                <Text style={{ color: colors.TEXT_MUTED, fontWeight: '700' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmVideo} style={[styles.modalConfirmBtn, { backgroundColor: colors.ACCENT }]}>
                <Check size={16} color="#ffffff" />
                <Text style={styles.modalConfirmText}>Ajouter Vidéo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  editorCard: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editorTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADII.pill,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: RADII.lg,
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.md,
  },
  toggleActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  toggleTextActive: {
    fontWeight: '800',
  },
  toolbarContainer: {
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  toolbarScroll: {
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    padding: 7,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 3,
  },
  colorPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    gap: 12,
    borderBottomWidth: 1,
  },
  colorPickerLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  textAreaInput: {
    minHeight: 140,
    padding: SPACING.md,
    fontSize: FONT_SIZE.base,
    lineHeight: 22,
  },
  previewScrollArea: {
    minHeight: 140,
    padding: SPACING.md,
  },
  previewContainer: {
    gap: 6,
  },
  emptyPreview: {
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    paddingVertical: SPACING.md,
  },
  previewH1: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  previewH2: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 2,
  },
  previewP: {
    fontSize: FONT_SIZE.base,
    lineHeight: 22,
  },
  previewListRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  previewBullet: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '900',
  },
  previewNum: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    fontWeight: '800',
  },
  previewListText: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    lineHeight: 20,
  },
  previewImgBox: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    marginVertical: 6,
  },
  previewInlineImg: {
    width: '100%',
    height: 160,
  },
  previewImgCaption: {
    fontSize: FONT_SIZE.xs,
    padding: 6,
    fontStyle: 'italic',
  },
  previewVideoBox: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    padding: 10,
    marginVertical: 6,
  },
  previewVideoTitle: {
    fontWeight: '800',
    fontSize: FONT_SIZE.sm,
  },
  previewVideoUrl: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  previewTableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: RADII.sm,
    overflow: 'hidden',
    marginVertical: 2,
  },
  previewTableCell: {
    flex: 1,
    padding: 8,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderTopWidth: 1,
  },
  footerStat: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  footerHint: {
    fontSize: FONT_SIZE.xs,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '800',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  modalPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: RADII.lg,
    paddingVertical: 12,
    marginBottom: SPACING.sm,
  },
  modalPickText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: SPACING.sm,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADII.lg,
  },
  modalConfirmText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: FONT_SIZE.xs,
  },
});
