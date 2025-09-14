<template>
  <div class="grid gap-6 mt-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
    <div v-if="items.length === 0" class="col-span-full flex justify-center">
      <div class="bg-card rounded-lg border p-4 w-full text-center">
        <p>Nenhum arquivo de mídia encontrado.</p>
      </div>
    </div>
    
    <template v-else>
      <div 
        v-for="item in localItems"
        :key="item.id"
        class="relative rounded-lg border border-border bg-card text-card-foreground p-2 flex flex-col items-center shadow-sm hover:shadow-md transition"
      >
       <!-- Badge de público -->
      <div v-if="item.isPublic" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full z-10">
        Público
      </div>
      <div v-else class="absolute top-2 left-2 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full z-10">
        Privado
      </div>
      
        <!-- Botões no topo -->
        <div class="absolute top-2 right-2 flex gap-1">
          <button @click="$emit('open-modal', item)" class="p-1 rounded-sm bg-background hover:bg-muted transition">
            <Eye class="w-4 h-4" />
          </button>
  
          <div class="relative">
            <button @click="toggleDropdown(item.id)" class="p-1 rounded-sm bg-background hover:bg-muted transition">
              <MoreVertical class="w-4 h-4" />
            </button>
  
            <div v-if="dropdownOpen === item.id" class="absolute right-0 mt-1 w-32 bg-card border border-border rounded shadow-md z-10">
              
              <!-- Checkbox público/privado -->
              <label class="flex items-center gap-2 px-3 py-1 text-sm hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  :checked="item.isPublic"
                  @change="() => togglePublicStatus(item)"
                  class="form-checkbox"
                />
                Público
              </label>

              <button
                class="block w-full px-3 py-1 text-sm hover:bg-muted"
                @click="() => { renameItem(item); toggleDropdown(null) }"
              >
                Renomear
              </button>
  
              <button
                class="block w-full px-3 py-1 text-sm hover:bg-muted"
                @click="() => { downloadItem(item); toggleDropdown(null) }"
              >
                Baixar
              </button>
  
              <button
                class="block w-full px-3 py-1 text-sm text-red-500 hover:bg-muted"
                @click="() => { deleteItem(item.id); toggleDropdown(null) }"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
  
        <!-- Ícone central -->
        <div class="w-full aspect-square flex items-center justify-center bg-muted rounded-md overflow-hidden">
          <div class="text-muted-foreground text-6xl">
            <div v-if="item.mimeType.includes('pdf')"><File /></div>
            
            <div v-else-if="item.mimeType.startsWith('image/')">
              <img
                :src="`/api/media/view/${item.id}`"
                alt="preview"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else-if="item.mimeType.startsWith('video/')"><FileVideo /></div>
            <div v-else><File /></div>
          </div>
        </div>
  
        <!-- Nome do arquivo -->
        <p class="text-sm mt-2 truncate text-center w-full" :title="item.fileName">{{ item.fileName }}</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Eye, MoreVertical, File, FileVideo } from 'lucide-vue-next';
import { showToast } from '@/utils/uiAlerts/toast';
import { showConfirm } from '@/utils/uiAlerts/confirm';

const props = defineProps({
  items: Array,
});

const localItems = ref([...props.items]);
watch(() => props.items, (newItems) => {
  localItems.value = [...newItems]
});

const emit = defineEmits(['open-modal','rename','download','delete']);

const dropdownOpen = ref(null);
function toggleDropdown(id) {
  dropdownOpen.value = dropdownOpen.value === id ? null : id;
};

async function renameItem(item) {
  console.log(item);
  const { value: novoNome } = await Swal.fire({
    title: `<h2 class="font-heading text-2xl font-bold text-ong-text">Renomear arquivo</h2>`,
    html: `
      <input 
        id="swal-input1" 
        class="swal2-input w-[50vh] mt-4 rounded-2xl border border-ong-text bg-ong-background text-ong-text text-base px-4 py-2 focus:ring-2 focus:ring-ong-primary focus:border-ong-primary transition-all" 
        placeholder="Novo nome" 
        value="${item.fileName}"
      >
    `,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    customClass: {
      popup: 'rounded-2xl shadow-lg bg-ong-background text-ong-text animate-scale-in',
      confirmButton: 'bg-ong-primary text-white font-bold px-4 py-2 rounded-xl hover:bg-ong-accent transition-all',
      cancelButton: 'bg-ong-secondary text-ong-text px-4 py-2 rounded-xl hover:text-ong-secondary transition-all',
    },
    preConfirm: () => document.getElementById('swal-input1').value
  })

  if (novoNome) {
    await renameMedia(item.id, novoNome);
    Swal.fire({
      icon: 'success',
      title: 'Salvo!',
      text: 'O nome do arquivo foi atualizado.',
      customClass: {
        popup: 'rounded-2xl shadow-md bg-ong-background text-ong-text animate-fade-in',
        confirmButton: 'bg-ong-primary text-white px-4 py-2 rounded-xl'
      },
      timer: 2000,
      showConfirmButton: false
    });
  }
};

async function deleteItem(id) {
  // Aguarda a confirmação do usuário
  const confirmed = await showConfirm({ text: 'Deseja realmente excluir este arquivo?' });
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
    if (res.ok) {
      localItems.value = localItems.value.filter(i => i.id !== id);
      showToast({
        icon: 'success',
        title: 'Arquivo excluído!',
        timer: 2000,
      })
    } else {
      const errData = await res.json();
      showToast({
        icon: 'error',
        title: 'Erro ao excluir arquivo',
        description: errData?.error || 'Tente novamente',
        timer: 2500,
      })
      console.error('Erro ao excluir:', errData);
    }
  } catch (err) {
    showToast({
      icon: 'error',
      title: 'Erro inesperado',
      description: err.message || 'Falha ao excluir',
      timer: 2500,
    });
    console.error(err);
  }
};

async function downloadItem(item) {
  const res = await fetch(`/api/media/download/${item.id}`);
  if (!res.ok) return console.error("Erro ao baixar");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = item.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};


async function renameMedia(id, novoNome) {
  const res = await fetch(`/api/media/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: novoNome }) });
  if (res.ok) {
    const updated = await res.json();

    const idx = localItems.value.findIndex(i => i.id === id);
    if (idx !== -1) localItems.value[idx].fileName = novoNome;

    // Emite para o pai caso queira atualizar a prop também
    emit('rename', { ...item, fileName: novoNome });

  } else console.error('Erro ao renomear:', await res.json());
};


</script>
