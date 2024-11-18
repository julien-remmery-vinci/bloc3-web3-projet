<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// User Info Fields
const nom = ref('')
const prenom = ref('')
const salary = ref(null)

// Subscriptions
const subscriptions = ref([
  { name: '', amount: 0, debitDate: '', recurrence: '' }
])

// Success message state
const successMessage = ref<string>('')

const getUserInfos = async () => {
  const { data, error } = await supabase
    .from('infos')
    .select('nom, prenom, salaire')
    .eq('user_id', user.value.id)

  if (error) {
    console.error('Erreur lors de la récupération des informations utilisateur :', error)
    return
  }

  if (data && data.length > 0) {
    nom.value = data[0].nom
    prenom.value = data[0].prenom
    salary.value = data[0].salaire
  }
}

const getSubscriptions = async () => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.value.id)

  if (error) {
    console.error('Erreur lors de la récupération des abonnements :', error)
    return
  }

  subscriptions.value = data || []
}

// Fetch user info and subscriptions when the component is mounted
onMounted(() => {
  getUserInfos()
  getSubscriptions()
})

// Add a new empty subscription input field
const addSubscription = () => {
  subscriptions.value.push({ name: '', amount: 0, debitDate: '', recurrence: '' })
}

// Save user info and subscriptions
const saveInfos = async () => {
  const { data } = await supabase.from('infos').select().eq('user_id', user.value.id)

  if (!data || data.length === 0) {
    const { error } = await supabase.from('infos')
      .insert({
        user_id: user.value.id,
        nom: nom.value,
        prenom: prenom.value,
        salaire: salary.value
      })

    if (error) {
      console.error('Erreur lors de la sauvegarde des informations utilisateur :', error)
    }
  } else {
    // Update user info
    const { error } = await supabase.from('infos')
      .update({
        nom: nom.value,
        prenom: prenom.value,
        salaire: salary.value
      })
      .eq('user_id', user.value.id)

    if (error) {
      console.error('Erreur lors de la mise à jour des informations utilisateur :', error)
    }
  }

  // Save subscriptions
  for (const subscription of subscriptions.value) {
    if (!subscription.name || !subscription.amount || !subscription.debitDate || !subscription.recurrence) {
      console.error('Veuillez remplir tous les champs de l\'abonnement.')
      continue
    }

    const { data: existingSubscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('name', subscription.name)
      .eq('amount', subscription.amount)
      .eq('debit_date', subscription.debitDate)
      .eq('recurrence', subscription.recurrence)

    if (fetchError) {
      console.error('Erreur lors de la vérification de l\'abonnement :', fetchError)
      continue
    }

    if (existingSubscriptions && existingSubscriptions.length > 0) {
      console.log('L\'abonnement existe déjà :', subscription.name)
      continue
    }

    const { error: insertError } = await supabase.from('subscriptions').insert({
      user_id: user.value.id,
      name: subscription.name,
      amount: subscription.amount,
      debit_date: subscription.debitDate,
      recurrence: subscription.recurrence
    })

    if (insertError) {
      console.error('Erreur lors de la sauvegarde de l\'abonnement :', insertError)
      continue
    }

    console.log('Abonnement sauvegardé :', subscription.name)
  }

  // Set success message
  successMessage.value = 'Informations enregistrées avec succès !'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000) // Effacer après 3 secondes
}
</script>

<template>
  <div class="infos-container">
    <h1 class="title">
      Entrez vos informations
    </h1>

    <!-- Success message -->
    <div
      v-if="successMessage"
      class="success-message"
    >
      {{ successMessage }}
    </div>

    <form
      class="form"
      @submit.prevent="saveInfos"
    >
      <!-- Nom et Prénom -->
      <div class="form-group-inline">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input
            id="nom"
            v-model="nom"
            type="text"
            placeholder="Entrez votre nom"
            class="input"
          >
        </div>
        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input
            id="prenom"
            v-model="prenom"
            type="text"
            placeholder="Entrez votre prénom"
            class="input"
          >
        </div>
      </div>

      <!-- Salaire -->
      <div class="form-group">
        <label for="salary">Salaire (€)</label>
        <input
          id="salary"
          v-model="salary"
          type="number"
          placeholder="Entrez votre salaire"
          class="input"
        >
      </div>

      <!-- Abonnements -->
      <div class="form-group">
        <h2>Abonnements</h2>
        <div
          v-for="(sub, index) in subscriptions"
          :key="index"
          class="subscription-item"
        >
          <div class="form-group-inline">
            <input
              v-model="sub.name"
              type="text"
              placeholder="Nom de l'abonnement"
              class="input"
            >
            <div class="input-wrapper">
              <input
                v-model="sub.amount"
                type="number"
                placeholder="Montant"
                class="input"
              >
              <span class="currency-symbol">€</span>
            </div>
            <input
              v-model="sub.debitDate"
              type="date"
              class="input"
            >
            <select
              v-model="sub.recurrence"
              class="input"
            >
              <option
                value=""
                disabled
              >
                Récurrence
              </option>
              <option value="monthly">
                Mensuel
              </option>
              <option value="yearly">
                Annuel
              </option>
            </select>
          </div>
        </div>
        <button
          type="button"
          class="add-btn"
          @click="addSubscription"
        >
          Ajouter un abonnement
        </button>
      </div>

      <button
        type="submit"
        class="save-btn"
      >
        Enregistrer
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Updated Styles */
.infos-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background-color: #1e293b;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.success-message {
  background-color: #4ade80;
  color: #000;
  text-align: center;
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.subscription-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #3b3b3b;
  border-radius: 5px;
  background-color: #2d3748;
  color: #fff;
}

.input-wrapper {
  position: relative;
}

.currency-symbol {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 0.9rem;
}

.add-btn,
.save-btn {
  background-color: #4ade80;
  color: #000;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover,
.save-btn:hover {
  background-color: #22c55e;
}
</style>
