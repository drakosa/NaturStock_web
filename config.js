// NaturaStock Cusco - Configuración de Supabase
// ============================================
// LOCAL: Reemplaza los valores de abajo con los de tu proyecto Supabase.
//   Project Settings > API > URL / anon key
//
// PRODUCCIÓN (Vercel): El build reemplaza automáticamente los valores
//   desde las Environment Variables SUPABASE_URL y SUPABASE_ANON_KEY.
//   No necesitas modificar este archivo para producción.
// ============================================

const SUPABASE_CONFIG = {
  url: window.__SUPABASE_URL__ || 'https://tu-proyecto.supabase.co',
  anonKey: window.__SUPABASE_ANON_KEY__ || 'tu-anon-key-aqui'
};
