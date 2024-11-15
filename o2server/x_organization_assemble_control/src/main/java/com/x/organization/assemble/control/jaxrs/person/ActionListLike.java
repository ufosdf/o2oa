package com.x.organization.assemble.control.jaxrs.person;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.bean.WrapCopier;
import com.x.base.core.project.bean.WrapCopierFactory;
import com.x.base.core.project.cache.Cache.CacheKey;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.ListTools;
import com.x.base.core.project.tools.StringTools;
import com.x.organization.assemble.control.Business;
import com.x.organization.core.entity.Person;
import com.x.organization.core.entity.Person_;

class ActionListLike extends BaseAction {

    private static final Logger LOGGER = LoggerFactory.getLogger(ActionListLike.class);

    ActionResult<List<Wo>> execute(EffectivePerson effectivePerson, JsonElement jsonElement)
            throws Exception {
        try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
            ActionResult<List<Wo>> result = new ActionResult<>();
            Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
            Business business = new Business(emc);
            CacheKey cacheKey = new CacheKey(this.getClass(),
                    effectivePerson.getDistinguishedName(), wi.getKey(),
                    StringUtils.join(wi.getGroupList(), ","),
                    StringUtils.join(wi.getRoleList(), ","),
                    BooleanUtils.isTrue(wi.getMultipleOrgTop()));
            Optional<?> optional = CacheManager.get(business.cache(), cacheKey);
            if (optional.isPresent()) {
                result.setData((List<Wo>) optional.get());
            } else {
                List<Wo> wos = this.list(business, effectivePerson, wi);
                CacheManager.put(business.cache(), cacheKey, wos);
                result.setData(wos);
            }
            this.updateControl(effectivePerson, business, result.getData());
            this.hide(effectivePerson, business, result.getData());
            return result;
        }
    }

    public static class Wi extends GsonPropertyObject {

        @FieldDescribe("搜索关键字")
        private String key;
        @FieldDescribe("搜索群组范围,为空则不限定")
        private List<String> groupList = new ArrayList<>();
        @FieldDescribe("搜索角色范围,为空则不限定")
        private List<String> roleList = new ArrayList<>();
        @FieldDescribe("是否搜索多个根组织")
        private Boolean multipleOrgTop;


        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public List<String> getGroupList() {
            return groupList;
        }

        public void setGroupList(List<String> groupList) {
            this.groupList = groupList;
        }

        public List<String> getRoleList() {
            return roleList;
        }

        public void setRoleList(List<String> roleList) {
            this.roleList = roleList;
        }

        public Boolean getMultipleOrgTop() {
            return multipleOrgTop;
        }

        public void setMultipleOrgTop(Boolean multipleOrgTop) {
            this.multipleOrgTop = multipleOrgTop;
        }
    }

    private List<Wo> list(Business business, EffectivePerson effectivePesron, Wi wi)
            throws Exception {
        List<Wo> wos = new ArrayList<>();
        if (StringUtils.isEmpty(wi.getKey())) {
            return wos;
        }
        List<String> personIds = business.expendGroupRoleToPerson(wi.getGroupList(),
                wi.getRoleList());
        String str = StringUtils.lowerCase(StringTools.escapeSqlLikeKey(wi.getKey()));
        EntityManager em = business.entityManagerContainer().get(Person.class);
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<String> cq = cb.createQuery(String.class);
        Root<Person> root = cq.from(Person.class);
        Predicate p = cb.like(cb.lower(root.get(Person_.name)), "%" + str + "%",
                StringTools.SQL_ESCAPE_CHAR);
        p = cb.or(p, cb.like(cb.lower(root.get(Person_.unique)), "%" + str + "%",
                StringTools.SQL_ESCAPE_CHAR));
        p = cb.or(p, cb.like(cb.lower(root.get(Person_.pinyin)), "%" + str + "%",
                StringTools.SQL_ESCAPE_CHAR));
        p = cb.or(p, cb.like(cb.lower(root.get(Person_.pinyinInitial)), "%" + str + "%",
                StringTools.SQL_ESCAPE_CHAR));
        p = cb.or(p, cb.like(cb.lower(root.get(Person_.mobile)), "%" + str + "%",
                StringTools.SQL_ESCAPE_CHAR));
        p = cb.or(p,
                cb.like(cb.lower(root.get(Person_.distinguishedName)), "%" + str + "%",
                        StringTools.SQL_ESCAPE_CHAR));
        if (ListTools.isNotEmpty(personIds)) {
            p = cb.and(p, root.get(Person_.id).in(personIds));
        } else {
            if (ListTools.isNotEmpty(wi.getGroupList(), wi.getRoleList())) {
                return wos;
            }
        }
        if (!BooleanUtils.isTrue(wi.getMultipleOrgTop())) {
            p = cb.and(p, business.personPredicateWithTopUnit(effectivePesron, false));
        }
        List<String> ids = em.createQuery(cq.select(root.get(Person_.id)).where(p)).getResultList()
                .stream().distinct()
                .collect(Collectors.toList());
        List<Person> os = business.entityManagerContainer().list(Person.class, ids);
        wos = Wo.copier.copy(os);
        wos = business.person().sort(wos);
        return wos;
    }

    public static class Wo extends WoPersonAbstract {

        private static final long serialVersionUID = -125007357898871894L;

        static WrapCopier<Person, Wo> copier = WrapCopierFactory.wo(Person.class, Wo.class, null,
                person_fieldsInvisible);

    }

}
