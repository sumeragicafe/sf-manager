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
        <h1>Home</h1>
        <p>{{ msg }}</p>
    </div>
    
</template>