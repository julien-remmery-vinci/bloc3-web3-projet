<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// User Info Fields
const nom = ref<string>('') // Nom de l'utilisateur
const prenom = ref<string>('') // Prénom de l'utilisateur
const salary = ref<number | null>(null) // Salaire de l'utilisateur

// Subscriptions
const subscriptions = ref([
  { name: '', amount: 0, debitDate: '', recurrence: '' }
]) // Liste des abonnements

// Success message state
const successMessage = ref<string>('')

// Fetch user info and subscriptions when the component is mounted
onMounted(async () => {
  if (!user.value) {
    console.error('Utilisateur non connecté.')
    return
  }

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

  // Upsert user info (since `user_id` is unique)
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

  // Save or update subscriptions
  for (const subscription of subscriptions.value) {
    if (!subscription.name || !subscription.amount || !subscription.debitDate || !subscription.recurrence) {
      console.error('Veuillez remplir tous les champs de l\'abonnement.')
      continue
    }

    // Use upsert to ensure uniqueness
    const { error: upsertError } = await supabase.from('subscriptions').upsert({
      user_id: user.value.id,
      name: subscription.name,
      amount: subscription.amount,
      debit_date: subscription.debitDate,
      recurrence: subscription.recurrence
    }, { onConflict: ['user_id', 'name', 'debit_date'] })

    if (upsertError) {
      console.error('Erreur lors de la sauvegarde de l\'abonnement :', upsertError)
      continue
    }

    console.log('Abonnement sauvegardé ou mis à jour :', subscription.name)
  }

  // Set success message
  successMessage.value = 'Informations enregistrées avec succès !'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000) // Clear after 3 seconds
}
</script>

<template>
  <div class="infos-container">
    <h1 class="title">Entrez vos informations</h1>

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

    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<style scoped>
.infos-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background-color: #1e293b;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

/* Success message styles */
.success-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4ade80;
  color: black;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1rem;
  animation: fade-in-out 3s forwards;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  10%,
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group-inline {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.subscription-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.subscription-item .form-group-inline {
  gap: 1rem;
}

.input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #3b3b3b;
  border-radius: 5px;
  background-color: #2d3748;
  color: #fff;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
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

.add-btn {
  margin-top: 1rem;
  align-self: flex-start;
}

.save-btn {
  align-self: center;
}

/* Ajustement de la largeur et visibilité des prix */
.subscription-item .input {
  flex: 1;
}

.subscription-item .currency-symbol {
  right: 20px;
}
</style>
