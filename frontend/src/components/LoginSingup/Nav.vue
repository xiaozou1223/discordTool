<template>
    <nav class="navbar navbar-expand-md sticky-top py-3 navbar-dark" id="mainNav">
                <div class="container"><a class="navbar-brand d-flex align-items-center" href="/"><span>DiscordTool</span></a>
                    <div class="collapse navbar-collapse" id="navcol-1">
                        <ul class="navbar-nav mx-auto">
                            <li class="nav-item"></li>
                        </ul>
                    </div>
                </div>
            </nav>
</template>
<script setup lang="ts">
    import router from '@/router';
    import Cookies from 'js-cookie';
    const token = Cookies.get('jwt');
    if(token){
        router.push({ name: 'User' });
    }
</script>

<style>
    span{
        user-select: none; /* For modern browsers */
        -webkit-user-select: none; /* For Safari */
        -moz-user-select: none; /* For Firefox */
        -ms-user-select: none; /* For Internet Explorer/Edge */
    }

</style>