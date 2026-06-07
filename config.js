<<<<<<< HEAD
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
=======
// ============================================
// NaturaStock Cusco - Configuración de Supabase
// ============================================
// INSTRUCCIONES:
// 1. Crea un proyecto en https://supabase.com
// 2. Ejecuta supabase-schema.sql en el SQL Editor
// 3. Reemplaza los valores debajo con los de tu proyecto
// 4. Ve a Project Settings > API para encontrar estos valores
// ============================================

const SUPABASE_CONFIG = {
  url: 'https://tu-proyecto.supabase.co',
  anonKey: 'tu-anon-key-aqui'
};
// NOTA: Usa la Key anónima (publishable) segura con RLS.
>>>>>>> f79a8a287dc281f2cc26bbfdc47af59a0094a974
