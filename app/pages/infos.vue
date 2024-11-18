<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// User Info Fields
const nom = ref<string>('')
const prenom = ref<string>('')
const salary = ref<number | null>(null)

// Subscriptions
const subscriptions = ref([
  { name: '', amount: 0, debitDate: '', recurrence: '' }
])

// Success message state
const successMessage = ref<string>('')

// Fetch user info and subscriptions when the component is mounted
onMounted(async () => {
  // Fetch user info
  const { data: userInfo, error: userError } = await supabase
    .from('infos')
    .select('nom, prenom, salaire')
    .eq('user_id', user.value.id)
    .single()

  if (userError) {
    console.error('Erreur lors de la récupération des informations utilisateur :', userError)
  } else if (userInfo) {
    nom.value = userInfo.nom
    prenom.value = userInfo.prenom
    salary.value = userInfo.salaire
  }

  // Fetch subscriptions
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.value.id)

  if (subscriptionError) {
    console.error('Erreur lors de la récupération des abonnements :', subscriptionError)
    return
  }

  subscriptions.value = subscriptionData || []
})

// Add a new empty subscription input field
const addSubscription = () => {
  subscriptions.value.push({ name: '', amount: 0, debitDate: '', recurrence: '' })
}

// Save user info and subscriptions
const saveInfos = async () => {
  if (!user.value) {
    console.error('Utilisateur non connecté.')
    return
  }

  // Save user info
  const { error: userInfoError } = await supabase.from('infos').upsert({
    user_id: user.value.id,
    nom: nom.value,
    prenom: prenom.value,
    salaire: salary.value
  })

  if (userInfoError) {
    console.error('Erreur lors de la sauvegarde des informations utilisateur :', userInfoError)
  } else {
    console.log('Informations utilisateur sauvegardées.')
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

  console.log('Toutes les informations ont été sauvegardées avec succès.')
}
</script>

<template>
  <div class="infos-container">
    <h1 class="title">Entrez vos informations</h1>

    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <form @submit.prevent="saveInfos" class="form">
      <!-- Nom et Prénom -->
      <div class="form-group-inline">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input
            id="nom"
            type="text"
            v-model="nom"
            placeholder="Entrez votre nom"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input
            id="prenom"
            type="text"
            v-model="prenom"
            placeholder="Entrez votre prénom"
            class="input"
          />
        </div>
      </div>

      <!-- Salaire -->
      <div class="form-group">
        <label for="salary">Salaire (€)</label>
        <input
          id="salary"
          type="number"
          v-model="salary"
          placeholder="Entrez votre salaire"
          class="input"
        />
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
              type="text"
              v-model="sub.name"
              placeholder="Nom de l'abonnement"
              class="input"
            />
            <div class="input-wrapper">
              <input
                type="number"
                v-model="sub.amount"
                placeholder="Montant"
                class="input"
              />
              <span class="currency-symbol">€</span>
            </div>
            <input
              type="date"
              v-model="sub.debitDate"
              class="input"
            />
            <select v-model="sub.recurrence" class="input">
              <option value="" disabled>Récurrence</option>
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>
        </div>
        <button type="button" @click="addSubscription" class="add-btn">
          Ajouter un abonnement
        </button>
      </div>

      <button type="submit" class="save-btn">Enregistrer</button>
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
