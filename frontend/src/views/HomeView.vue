<script>
export default {
    name: 'HomeView',
    data(){
        return{
            msg: 'Welcome to the Home page'
        }
    }
};


</script>

<template>
    <div>
        <h1 class="text-3xl font-bold underline" >Home</h1>
        <p>{{ msg }}</p>
    </div>
    
</template>